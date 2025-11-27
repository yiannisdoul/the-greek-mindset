// src/lib/content-service.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ContentBlock, ContentUpdateRequest, CONTENT_TEMPLATES, FAQItem } from '@/types/content';

export class ContentService {
  private readonly COLLECTION_NAME = 'dynamicContent';

  /**
   * Initialize default content for all pages
   */
  async initializeDefaultContent(adminUserId: string): Promise<void> {
    try {
      const now = new Date();
      const promises: Promise<void>[] = [];

      for (const [pageKey, template] of Object.entries(CONTENT_TEMPLATES)) {
        for (const [sectionKey, section] of Object.entries(template.sections)) {
          for (let i = 0; i < section.blocks.length; i++) {
            const block = section.blocks[i];
            const contentBlock = {
              key: block.key,
              content: block.defaultContent,
              contentType: block.contentType,
              page: pageKey,
              section: sectionKey,
              position: i,
              isActive: true,
              createdAt: Timestamp.fromDate(now),
              updatedAt: Timestamp.fromDate(now),
              createdBy: adminUserId,
              lastUpdatedBy: adminUserId
            };

            const docRef = doc(collection(db, this.COLLECTION_NAME));
            promises.push(setDoc(docRef, contentBlock));
          }
        }
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error initializing default content:', error);
      throw error;
    }
  }

  /**
   * Get all content blocks for a specific page
   */
  async getPageContent(page: string): Promise<ContentBlock[]> {
    try {
      // First try the optimized query with indexes
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('page', '==', page),
        where('isActive', '==', true),
        orderBy('section'),
        orderBy('position')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ContentBlock[];
    } catch (error) {
      console.error('Error fetching page content with optimized query:', error);
      
      // Fallback: Use simpler query without orderBy if indexes aren't ready
      try {
        console.log('Trying fallback query without orderBy...');
        const fallbackQ = query(
          collection(db, this.COLLECTION_NAME),
          where('page', '==', page),
          where('isActive', '==', true)
        );

        const snapshot = await getDocs(fallbackQ);
        const blocks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as ContentBlock[];

        // Sort manually in JavaScript
        return blocks.sort((a, b) => {
          if (a.section !== b.section) {
            return a.section.localeCompare(b.section);
          }
          return a.position - b.position;
        });
      } catch (fallbackError) {
        console.error('Error with fallback query:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Get all content blocks
   */
  async getAllContent(): Promise<ContentBlock[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('page'),
        orderBy('section'),
        orderBy('position')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ContentBlock[];
    } catch (error) {
      console.error('Error fetching all content:', error);
      return [];
    }
  }

  /**
   * Get a specific content block by key
   */
  async getContentByKey(key: string): Promise<ContentBlock | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('key', '==', key),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ContentBlock;
    } catch (error) {
      console.error('Error fetching content by key:', error);
      return null;
    }
  }

  /**
   * Update content block
   */
  async updateContent(contentId: string, updateData: ContentUpdateRequest): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, contentId);
      await updateDoc(docRef, {
        content: updateData.content,
        updatedAt: Timestamp.fromDate(new Date()),
        lastUpdatedBy: updateData.updatedBy
      });
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  /**
   * Bulk update multiple content blocks
   */
  async bulkUpdateContent(updates: Array<{ id: string; content: string; updatedBy: string }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.fromDate(new Date());

      for (const update of updates) {
        const docRef = doc(db, this.COLLECTION_NAME, update.id);
        batch.update(docRef, {
          content: update.content,
          updatedAt: now,
          lastUpdatedBy: update.updatedBy
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error bulk updating content:', error);
      throw error;
    }
  }

  /**
   * Create new content block
   */
  async createContent(contentData: Omit<ContentBlock, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(db, this.COLLECTION_NAME));
      await setDoc(docRef, {
        ...contentData,
        createdAt: Timestamp.fromDate(contentData.createdAt),
        updatedAt: Timestamp.fromDate(contentData.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  /**
   * Delete content block (soft delete by setting isActive to false)
   */
  async deleteContent(contentId: string, adminUserId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, contentId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.fromDate(new Date()),
        lastUpdatedBy: adminUserId
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  /**
   * Check if content exists for a page, and initialize if not
   */
  async ensurePageContentExists(page: string, adminUserId: string): Promise<void> {
    try {
      console.log('ContentService: ensurePageContentExists called with:', { page, adminUserId });
      
      const existingContent = await this.getPageContent(page);
      console.log('ContentService: Found existing content blocks:', existingContent.length);
      
      if (existingContent.length === 0 && CONTENT_TEMPLATES[page]) {
        console.log('ContentService: No content found, initializing for page:', page);
        
        // Initialize content for this specific page
        const template = CONTENT_TEMPLATES[page];
        const now = new Date();
        const promises: Promise<void>[] = [];

        console.log('ContentService: Template sections:', Object.keys(template.sections));

        for (const [sectionKey, section] of Object.entries(template.sections)) {
          console.log('ContentService: Processing section:', sectionKey, 'with', section.blocks.length, 'blocks');
          
          for (let i = 0; i < section.blocks.length; i++) {
            const block = section.blocks[i];
            const contentBlock = {
              key: block.key,
              content: block.defaultContent,
              contentType: block.contentType,
              page: page,
              section: sectionKey,
              position: i,
              isActive: true,
              createdAt: Timestamp.fromDate(now),
              updatedAt: Timestamp.fromDate(now),
              createdBy: adminUserId,
              lastUpdatedBy: adminUserId
            };

            console.log('ContentService: Creating content block:', block.key);
            const docRef = doc(collection(db, this.COLLECTION_NAME));
            promises.push(setDoc(docRef, contentBlock));
          }
        }

        console.log('ContentService: Executing', promises.length, 'document writes');
        await Promise.all(promises);
        console.log('ContentService: All content blocks created successfully');
      } else if (!CONTENT_TEMPLATES[page]) {
        console.log('ContentService: No template found for page:', page);
        throw new Error(`No template found for page: ${page}`);
      } else {
        console.log('ContentService: Content already exists, skipping initialization');
      }
    } catch (error) {
      console.error('ContentService: Error ensuring page content exists:', error);
      throw error;
    }
  }

  /**
   * Get content as key-value pairs for easy lookup
   */
  async getContentMap(page?: string): Promise<Record<string, string>> {
    const content = page ? await this.getPageContent(page) : await this.getAllContent();
    const contentMap: Record<string, string> = {};
    
    content.forEach(block => {
      contentMap[block.key] = block.content;
    });

    return contentMap;
  }

  /**
   * Reset page content to defaults
   */
  async resetPageToDefaults(page: string, adminUserId: string): Promise<void> {
    if (!CONTENT_TEMPLATES[page]) {
      throw new Error(`No template found for page: ${page}`);
    }

    // Disable existing content
    const existingContent = await this.getPageContent(page);
    const batch = writeBatch(db);

    // Disable old content
    for (const content of existingContent) {
      const docRef = doc(db, this.COLLECTION_NAME, content.id);
      batch.update(docRef, {
        isActive: false,
        updatedAt: Timestamp.fromDate(new Date()),
        lastUpdatedBy: adminUserId
      });
    }

    // Create new default content
    const template = CONTENT_TEMPLATES[page];
    const now = new Date();

    for (const [sectionKey, section] of Object.entries(template.sections)) {
      for (let i = 0; i < section.blocks.length; i++) {
        const block = section.blocks[i];
        const contentBlock: Omit<ContentBlock, 'id'> = {
          key: block.key,
          content: block.defaultContent,
          contentType: block.contentType,
          page: page,
          section: sectionKey,
          position: i,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          createdBy: adminUserId,
          lastUpdatedBy: adminUserId
        };

        const docRef = doc(collection(db, this.COLLECTION_NAME));
        batch.set(docRef, {
          ...contentBlock,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now)
        });
      }
    }

    await batch.commit();
  }

  /**
   * Delete all content blocks (soft delete)
   */
  async deleteAllContent(adminUserId: string): Promise<void> {
    try {
      const allContent = await this.getAllContent();
      const batch = writeBatch(db);
      const now = Timestamp.fromDate(new Date());

      for (const content of allContent) {
        const docRef = doc(db, this.COLLECTION_NAME, content.id);
        batch.update(docRef, {
          isActive: false,
          updatedAt: now,
          lastUpdatedBy: adminUserId
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error deleting all content:', error);
      throw error;
    }
  }

  /**
   * Permanently delete all content blocks (hard delete)
   */
  async permanentlyDeleteAllContent(): Promise<void> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => {
        batch.delete(doc(db, this.COLLECTION_NAME, document.id));
      });

      await batch.commit();
    } catch (error) {
      console.error('Error permanently deleting all content:', error);
      throw error;
    }
  }

  /**
   * Reset all content to defaults for all pages
   */
  async resetAllContentToDefaults(adminUserId: string): Promise<void> {
    try {
      // First delete all existing content
      await this.deleteAllContent(adminUserId);
      
      // Then reinitialize all default content
      await this.initializeDefaultContent(adminUserId);
    } catch (error) {
      console.error('Error resetting all content to defaults:', error);
      throw error;
    }
  }

  // FAQ Item Management Methods

  private readonly FAQ_COLLECTION_NAME = 'faqItems';

  /**
   * Get all FAQ items ordered by category and position
   */
  async getFAQItems(): Promise<FAQItem[]> {
    try {
      const q = query(
        collection(db, this.FAQ_COLLECTION_NAME),
        where('isActive', '==', true),
        orderBy('category'),
        orderBy('position')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question,
          answer: data.answer,
          category: data.category,
          position: data.position,
          isActive: data.isActive,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          createdBy: data.createdBy,
          lastUpdatedBy: data.lastUpdatedBy
        } as FAQItem;
      });
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      throw error;
    }
  }

  /**
   * Add a new FAQ item
   */
  async addFAQItem(item: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = doc(collection(db, this.FAQ_COLLECTION_NAME));
      const now = Timestamp.now();
      
      await setDoc(docRef, {
        ...item,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding FAQ item:', error);
      throw error;
    }
  }

  /**
   * Update an existing FAQ item
   */
  async updateFAQItem(id: string, updates: Partial<Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>>, adminUserId: string): Promise<void> {
    try {
      const docRef = doc(db, this.FAQ_COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        lastUpdatedBy: adminUserId,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      throw error;
    }
  }

  /**
   * Delete an FAQ item (soft delete by setting isActive to false)
   */
  async deleteFAQItem(id: string, adminUserId: string): Promise<void> {
    try {
      const docRef = doc(db, this.FAQ_COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isActive: false,
        lastUpdatedBy: adminUserId,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      throw error;
    }
  }

  /**
   * Get FAQ items grouped by category
   */
  async getFAQItemsByCategory(): Promise<{ [category: string]: FAQItem[] }> {
    try {
      const items = await this.getFAQItems();
      const grouped: { [category: string]: FAQItem[] } = {};
      
      items.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      return grouped;
    } catch (error) {
      console.error('Error grouping FAQ items by category:', error);
      throw error;
    }
  }

  /**
   * Initialize default FAQ items
   */
  async initializeDefaultFAQItems(adminUserId: string): Promise<void> {
    try {
      const defaultFAQs: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          question: "What is The Greek Mindset philosophy?",
          answer: "The Greek Mindset is based on the ancient Greek principle of achieving excellence in both mind and body. We believe in the holistic development of individuals through philosophy, physical training, and cultural enrichment.",
          category: "Philosophy",
          position: 1,
          isActive: true,
          createdBy: adminUserId,
          lastUpdatedBy: adminUserId
        },
        {
          question: "How do I get started with the workout programs?",
          answer: "You can start by exploring our Body section, which includes Spartan-inspired workouts. Create an account to track your progress and access personalized training plans.",
          category: "Fitness",
          position: 1,
          isActive: true,
          createdBy: adminUserId,
          lastUpdatedBy: adminUserId
        },
        {
          question: "Are the recipes suitable for beginners?",
          answer: "Yes! Our Greek cooking recipes range from beginner-friendly to advanced. Each recipe includes detailed instructions and tips to help you master traditional Greek cuisine.",
          category: "Cooking",
          position: 1,
          isActive: true,
          createdBy: adminUserId,
          lastUpdatedBy: adminUserId
        },
        {
          question: "How do I access the community features?",
          answer: "Once you create an account, you can join discussions, share your progress, and connect with other members in our Community section.",
          category: "Platform",
          position: 1,
          isActive: true,
          createdBy: adminUserId,
          lastUpdatedBy: adminUserId
        }
      ];

      for (const faq of defaultFAQs) {
        await this.addFAQItem(faq);
      }
    } catch (error) {
      console.error('Error initializing default FAQ items:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();