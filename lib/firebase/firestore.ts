import { db } from "./config"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
} from "firebase/firestore"

// User Profiles
export const createUserProfile = async (userId: string, data: DocumentData) => {
  await setDoc(doc(db, "userProfiles", userId), data)
}

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, "userProfiles", userId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}

export const updateUserProfile = async (userId: string, data: DocumentData) => {
  const userRef = doc(db, "userProfiles", userId)
  await updateDoc(userRef, data)
}

// Articles/Blog Posts
export const createArticle = async (data: DocumentData) => {
  const articlesRef = collection(db, "articles")
  await setDoc(doc(articlesRef), data)
}

export const getArticles = async () => {
  const articlesRef = collection(db, "articles")
  const querySnapshot = await getDocs(articlesRef)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getArticle = async (articleId: string) => {
  const docRef = doc(db, "articles", articleId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateArticle = async (articleId: string, data: DocumentData) => {
  const articleRef = doc(db, "articles", articleId)
  await updateDoc(articleRef, data)
}

export const deleteArticle = async (articleId: string) => {
  await deleteDoc(doc(db, "articles", articleId))
}

// Workout Plans
export const createWorkoutPlan = async (data: DocumentData) => {
  const workoutPlansRef = collection(db, "workoutPlans")
  await setDoc(doc(workoutPlansRef), data)
}

export const getWorkoutPlans = async () => {
  const workoutPlansRef = collection(db, "workoutPlans")
  const querySnapshot = await getDocs(workoutPlansRef)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getWorkoutPlan = async (planId: string) => {
  const docRef = doc(db, "workoutPlans", planId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateWorkoutPlan = async (planId: string, data: DocumentData) => {
  const planRef = doc(db, "workoutPlans", planId)
  await updateDoc(planRef, data)
}

export const deleteWorkoutPlan = async (planId: string) => {
  await deleteDoc(doc(db, "workoutPlans", planId))
}

// Product Catalog
export const createProduct = async (data: DocumentData) => {
  const productsRef = collection(db, "products")
  await setDoc(doc(productsRef), data)
}

export const getProducts = async () => {
  const productsRef = collection(db, "products")
  const querySnapshot = await getDocs(productsRef)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getProduct = async (productId: string) => {
  const docRef = doc(db, "products", productId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const updateProduct = async (productId: string, data: DocumentData) => {
  const productRef = doc(db, "products", productId)
  await updateDoc(productRef, data)
}

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, "products", productId))
}

