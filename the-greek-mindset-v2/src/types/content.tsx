// src/types/content.tsx
export interface ContentBlock {
  id: string;
  key: string; // Unique identifier for the content block (e.g., 'homepage.hero.title')
  content: string;
  contentType: 'text' | 'html' | 'markdown';
  page: string; // Page identifier (e.g., 'homepage', 'mind', 'body')
  section: string; // Section within the page (e.g., 'hero', 'mission', 'features')
  position: number; // Order within the section
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
  lastUpdatedBy: string; // Admin user ID
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUpdatedBy: string;
}

export interface ContentTemplate {
  page: string;
  sections: {
    [sectionName: string]: {
      name: string;
      description: string;
      blocks: {
        key: string;
        label: string;
        contentType: 'text' | 'html' | 'markdown';
        defaultContent: string;
        placeholder?: string;
      }[];
    };
  };
}

export interface ContentUpdateRequest {
  key: string;
  content: string;
  updatedBy: string;
}

// Predefined content templates for different pages
export const CONTENT_TEMPLATES: Record<string, ContentTemplate> = {
  homepage: {
    page: 'homepage',
    sections: {
      hero: {
        name: 'Hero Section',
        description: 'Main landing section with title and description',
        blocks: [
          {
            key: 'homepage.hero.title',
            label: 'Main Title',
            contentType: 'text',
            defaultContent: 'The Greek Mindset',
            placeholder: 'Enter the main page title...'
          },
          {
            key: 'homepage.hero.subtitle',
            label: 'Subtitle',
            contentType: 'text',
            defaultContent: 'Ancient wisdom for modern living. Cultivate your mind and strengthen your body through the timeless principles of Greek philosophy and physical culture.',
            placeholder: 'Enter the subtitle...'
          },
          {
            key: 'homepage.hero.description',
            label: 'Description',
            contentType: 'text',
            defaultContent: 'Embark on a journey of holistic development, where the pursuit of knowledge and physical excellence merge into a harmonious way of life. Discover the secrets that made ancient Greece the cradle of Western civilization and apply them to your modern existence.',
            placeholder: 'Enter the main description...'
          }
        ]
      },
      bodySection: {
        name: 'Body Section',
        description: 'Physical training section content',
        blocks: [
          {
            key: 'homepage.body.title',
            label: 'Body Section Title',
            contentType: 'text',
            defaultContent: 'BODY',
            placeholder: 'Enter body section title...'
          },
          {
            key: 'homepage.body.description',
            label: 'Body Section Description',
            contentType: 'text',
            defaultContent: 'Train like a Spartan warrior. Develop functional strength, agility, and endurance through ancient Greek training methods adapted for the modern world.',
            placeholder: 'Enter body section description...'
          },
          {
            key: 'homepage.body.buttonText',
            label: 'Body Button Text',
            contentType: 'text',
            defaultContent: 'Begin Physical Training',
            placeholder: 'Enter button text...'
          }
        ]
      },
      mindSection: {
        name: 'Mind Section',
        description: 'Mental training section content',
        blocks: [
          {
            key: 'homepage.mind.title',
            label: 'Mind Section Title',
            contentType: 'text',
            defaultContent: 'MIND',
            placeholder: 'Enter mind section title...'
          },
          {
            key: 'homepage.mind.description',
            label: 'Mind Section Description',
            contentType: 'text',
            defaultContent: 'Explore the depths of Greek philosophy, history, and culture. Sharpen your intellect and gain wisdom that has guided humanity for millennia.',
            placeholder: 'Enter mind section description...'
          },
          {
            key: 'homepage.mind.buttonText',
            label: 'Mind Button Text',
            contentType: 'text',
            defaultContent: 'Begin Mental Training',
            placeholder: 'Enter button text...'
          }
        ]
      }
    }
  },
  mind: {
    page: 'mind',
    sections: {
      hero: {
        name: 'Hero Section',
        description: 'Main mind page introduction',
        blocks: [
          {
            key: 'mind.hero.title',
            label: 'Page Title',
            contentType: 'text',
            defaultContent: 'Cultivate Your Mind',
            placeholder: 'Enter page title...'
          },
          {
            key: 'mind.hero.subtitle',
            label: 'Subtitle',
            contentType: 'text',
            defaultContent: 'Ancient Wisdom for Modern Minds',
            placeholder: 'Enter subtitle...'
          },
          {
            key: 'mind.hero.description',
            label: 'Description',
            contentType: 'text',
            defaultContent: 'Embark on an intellectual journey through the rich tapestry of Greek civilization. From the philosophical insights of Socrates and Plato to the heroic tales of mythology, discover the knowledge that shaped Western thought and continues to inspire minds today.',
            placeholder: 'Enter main description...'
          }
        ]
      },
      categories: {
        name: 'Category Descriptions',
        description: 'Individual category descriptions',
        blocks: [
          {
            key: 'mind.philosophy.description',
            label: 'Philosophy Description',
            contentType: 'text',
            defaultContent: 'Explore the fundamental questions of existence, ethics, and knowledge through the lens of ancient Greek philosophers.',
            placeholder: 'Enter philosophy description...'
          },
          {
            key: 'mind.history.description',
            label: 'History Description',
            contentType: 'text',
            defaultContent: 'Journey through the rise and fall of Greek city-states, wars, and the events that shaped civilization.',
            placeholder: 'Enter history description...'
          },
          {
            key: 'mind.geography.description',
            label: 'Geography Description',
            contentType: 'text',
            defaultContent: 'Discover the landscapes, islands, and regions that formed the backdrop of Greek civilization.',
            placeholder: 'Enter geography description...'
          },
          {
            key: 'mind.mythology.description',
            label: 'Mythology Description',
            contentType: 'text',
            defaultContent: 'Delve into the captivating world of Greek gods, heroes, and legendary tales that continue to inspire.',
            placeholder: 'Enter mythology description...'
          }
        ]
      }
    }
  },
  body: {
    page: 'body',
    sections: {
      hero: {
        name: 'Hero Section',
        description: 'Main body page introduction',
        blocks: [
          {
            key: 'body.hero.title',
            label: 'Page Title',
            contentType: 'text',
            defaultContent: 'Forge Your Body',
            placeholder: 'Enter page title...'
          },
          {
            key: 'body.hero.subtitle',
            label: 'Subtitle',
            contentType: 'text',
            defaultContent: 'Ancient Strength for Modern Warriors',
            placeholder: 'Enter subtitle...'
          },
          {
            key: 'body.hero.description',
            label: 'Description',
            contentType: 'text',
            defaultContent: 'Transform your physical being through time-tested Greek training methods. From Spartan conditioning to Olympic athletics, discover the secrets of ancient Greek physical culture and apply them to build strength, endurance, and grace in your modern life.',
            placeholder: 'Enter main description...'
          }
        ]
      },
      categories: {
        name: 'Category Descriptions',
        description: 'Individual category descriptions',
        blocks: [
          {
            key: 'body.spartan.description',
            label: 'Spartan Workout Description',
            contentType: 'text',
            defaultContent: 'Train with the legendary discipline and intensity of Spartan warriors.',
            placeholder: 'Enter Spartan workout description...'
          },
          {
            key: 'body.dancing.description',
            label: 'Greek Dancing Description',
            contentType: 'text',
            defaultContent: 'Express yourself through traditional Greek dances that celebrate culture and build coordination.',
            placeholder: 'Enter Greek dancing description...'
          },
          {
            key: 'body.cooking.description',
            label: 'Greek Cooking Description',
            contentType: 'text',
            defaultContent: 'Nourish your body with authentic Greek recipes and Mediterranean nutrition principles.',
            placeholder: 'Enter Greek cooking description...'
          }
        ]
      }
    }
  },
  faq: {
    page: 'faq',
    sections: {
      hero: {
        name: 'FAQ Hero Section',
        description: 'Main FAQ page title and description',
        blocks: [
          {
            key: 'faq.hero.title',
            label: 'Page Title',
            contentType: 'text',
            defaultContent: 'Frequently Asked Questions',
            placeholder: 'Enter FAQ page title...'
          },
          {
            key: 'faq.hero.subtitle',
            label: 'Page Subtitle',
            contentType: 'text',
            defaultContent: 'Find answers to common questions about The Greek Mindset',
            placeholder: 'Enter FAQ page subtitle...'
          },
          {
            key: 'faq.hero.description',
            label: 'Page Description',
            contentType: 'text',
            defaultContent: 'Get quick answers to your questions about our philosophy courses, fitness programs, recipes, and more. If you cannot find what you are looking for, feel free to contact us.',
            placeholder: 'Enter FAQ page description...'
          }
        ]
      },
      contact: {
        name: 'Contact Information',
        description: 'Contact details and support information',
        blocks: [
          {
            key: 'faq.contact.title',
            label: 'Contact Section Title',
            contentType: 'text',
            defaultContent: 'Still have questions?',
            placeholder: 'Enter contact section title...'
          },
          {
            key: 'faq.contact.description',
            label: 'Contact Description',
            contentType: 'text',
            defaultContent: 'We\'re here to help! Reach out to our team for personalized support and guidance on your Greek Mindset journey.',
            placeholder: 'Enter contact description...'
          }
        ]
      }
    }
  },
  about: {
    page: 'about',
    sections: {
      hero: {
        name: 'About Hero Section',
        description: 'Main about page introduction',
        blocks: [
          {
            key: 'about.hero.title',
            label: 'Page Title',
            contentType: 'text',
            defaultContent: 'About The Greek Mindset',
            placeholder: 'Enter about page title...'
          },
          {
            key: 'about.hero.subtitle',
            label: 'Page Subtitle',
            contentType: 'text',
            defaultContent: 'Ancient Wisdom for Modern Living',
            placeholder: 'Enter about page subtitle...'
          },
          {
            key: 'about.hero.description',
            label: 'Hero Description',
            contentType: 'text',
            defaultContent: 'Discover how ancient Greek philosophy, fitness, and culture can transform your modern life through our comprehensive platform dedicated to holistic well-being.',
            placeholder: 'Enter hero description...'
          }
        ]
      },
      mission: {
        name: 'Mission Section',
        description: 'Company mission and values',
        blocks: [
          {
            key: 'about.mission.title',
            label: 'Mission Title',
            contentType: 'text',
            defaultContent: 'Our Mission',
            placeholder: 'Enter mission title...'
          },
          {
            key: 'about.mission.description',
            label: 'Mission Description',
            contentType: 'text',
            defaultContent: 'To bridge the gap between ancient Greek wisdom and contemporary living, empowering individuals to cultivate both mind and body through time-tested principles of philosophy, fitness, and culture.',
            placeholder: 'Enter mission description...'
          }
        ]
      },
      story: {
        name: 'Our Story',
        description: 'Company background and founding story',
        blocks: [
          {
            key: 'about.story.title',
            label: 'Story Title',
            contentType: 'text',
            defaultContent: 'Our Story',
            placeholder: 'Enter story title...'
          },
          {
            key: 'about.story.description',
            label: 'Story Description',
            contentType: 'text',
            defaultContent: 'Founded on the belief that ancient Greek culture holds the keys to modern wellness, The Greek Mindset was created to make timeless wisdom accessible to today\'s world. We combine scholarly research with practical application to help you live your best life.',
            placeholder: 'Enter story description...'
          }
        ]
      }
    }
  },
  contact: {
    page: 'contact',
    sections: {
      hero: {
        name: 'Contact Header',
        description: 'Main header and introduction',
        blocks: [
          {
            key: 'contact.hero.title',
            label: 'Page Title',
            contentType: 'text',
            defaultContent: 'Contact Us',
            placeholder: 'Enter page title...'
          },
          {
            key: 'contact.hero.subtitle',
            label: 'Subtitle',
            contentType: 'text',
            defaultContent: 'Get in touch with us for any questions or support',
            placeholder: 'Enter subtitle...'
          },
          {
            key: 'contact.hero.description',
            label: 'Description',
            contentType: 'text',
            defaultContent: 'We\'re here to help you on your journey toward holistic excellence through ancient Greek wisdom.',
            placeholder: 'Enter description...'
          }
        ]
      },
      contactInfo: {
        name: 'Contact Information',
        description: 'Contact details and methods',
        blocks: [
          {
            key: 'contact.info.email.title',
            label: 'Email Section Title',
            contentType: 'text',
            defaultContent: 'Email',
            placeholder: 'Enter email section title...'
          },
          {
            key: 'contact.info.email.description',
            label: 'Email Description',
            contentType: 'text',
            defaultContent: 'Send us an email anytime',
            placeholder: 'Enter email description...'
          },
          {
            key: 'contact.info.email.address',
            label: 'Email Address',
            contentType: 'text',
            defaultContent: 'support@greekmindset.com',
            placeholder: 'Enter email address...'
          },
          {
            key: 'contact.info.phone.title',
            label: 'Phone Section Title',
            contentType: 'text',
            defaultContent: 'Phone',
            placeholder: 'Enter phone section title...'
          },
          {
            key: 'contact.info.phone.description',
            label: 'Phone Description',
            contentType: 'text',
            defaultContent: 'Call us during business hours',
            placeholder: 'Enter phone description...'
          },
          {
            key: 'contact.info.phone.number',
            label: 'Phone Number',
            contentType: 'text',
            defaultContent: '+1 (234) 567-890',
            placeholder: 'Enter phone number...'
          },
          {
            key: 'contact.info.address.title',
            label: 'Address Section Title',
            contentType: 'text',
            defaultContent: 'Address',
            placeholder: 'Enter address section title...'
          },
          {
            key: 'contact.info.address.details',
            label: 'Address Details',
            contentType: 'text',
            defaultContent: '123 Wisdom Street, Athens District, Mindset City, MC 12345',
            placeholder: 'Enter address details...'
          },
          {
            key: 'contact.info.hours.title',
            label: 'Business Hours Title',
            contentType: 'text',
            defaultContent: 'Business Hours',
            placeholder: 'Enter business hours title...'
          },
          {
            key: 'contact.info.hours.weekdays',
            label: 'Weekday Hours',
            contentType: 'text',
            defaultContent: 'Monday - Friday: 9:00 AM - 6:00 PM',
            placeholder: 'Enter weekday hours...'
          },
          {
            key: 'contact.info.hours.saturday',
            label: 'Saturday Hours',
            contentType: 'text',
            defaultContent: 'Saturday: 10:00 AM - 4:00 PM',
            placeholder: 'Enter Saturday hours...'
          },
          {
            key: 'contact.info.hours.sunday',
            label: 'Sunday Hours',
            contentType: 'text',
            defaultContent: 'Sunday: Closed',
            placeholder: 'Enter Sunday hours...'
          }
        ]
      },
      support: {
        name: 'Support Section',
        description: 'Additional support information',
        blocks: [
          {
            key: 'contact.support.title',
            label: 'Support Title',
            contentType: 'text',
            defaultContent: 'Need Help?',
            placeholder: 'Enter support title...'
          },
          {
            key: 'contact.support.description',
            label: 'Support Description',
            contentType: 'text',
            defaultContent: 'Our support team is here to help you with any questions about your Greek mindset journey. We typically respond to emails within 24 hours and are committed to guiding you toward holistic excellence.',
            placeholder: 'Enter support description...'
          }
        ]
      }
    }
  }
};