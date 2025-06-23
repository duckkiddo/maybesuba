import { v2 as cloudinary } from "cloudinary"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import { verifyCloudinaryOperation, verifyMongoDBOperation, logVerificationResult } from "./verification"

// Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Type for the upload result
export interface CloudinaryUploadResult {
  url: string
  publicId: string
  resourceType: string
  format: string
  bytes: number
}

// Extend resourceType to include "auto"
type CloudinaryResourceType = "image" | "video" | "raw" | "auto"

// Upload function
export const uploadToCloudinary = async (
  file: string | Buffer,
  folder = "vargo-agro",
  resourceType: CloudinaryResourceType = "auto"
): Promise<CloudinaryUploadResult> => {
  try {
    // Convert Buffer to base64 string if needed
    const uploadFile = Buffer.isBuffer(file)
      ? `data:application/octet-stream;base64,${file.toString("base64")}`
      : file

    const result = await cloudinary.uploader.upload(uploadFile, {
      folder,
      resource_type: resourceType,
      quality: "auto",
      fetch_format: "auto",
    })

    const uploadResult = {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    }

    // Verify the upload operation
    const verification = verifyCloudinaryOperation(uploadResult, 'upload');
    logVerificationResult(verification, 'Cloudinary upload');

    if (!verification.success) {
      throw new Error(verification.message);
    }

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error("Failed to upload to Cloudinary")
  }
}

// Delete function
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    // Verify the delete operation
    const verification = verifyCloudinaryOperation({ result }, 'delete');
    logVerificationResult(verification, 'Cloudinary delete');

    return verification.success;
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return false;
  }
}

export default cloudinary

// Notice functions

interface NoticeData {
  title: string
  content: string
  description?: string
  category?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  originalName?: string
  showAsPopup: boolean
  isActive: boolean
  priority: string
}

interface Notice extends NoticeData {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export async function getNotices(): Promise<Notice[]> {
  const db = await getDatabase()
  const notices = await db.collection<Notice>("notices").find({}).toArray()
  console.log(`Retrieved ${notices.length} notices from database`);
  return notices.map(notice => ({
    ...notice,
    id: notice._id.toHexString(),
  }))
}

export async function createNotice(data: NoticeData): Promise<Notice & { id: string }> {
  const db = await getDatabase()
  const result = await db.collection<NoticeData>("notices").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Verify the create operation
  const verification = verifyMongoDBOperation(result, 'create');
  logVerificationResult(verification, 'Notice creation');

  if (!verification.success) {
    throw new Error(verification.message);
  }

  const newNotice = await db.collection<Notice>("notices").findOne({ _id: result.insertedId })
  if (!newNotice) throw new Error("Failed to create notice")
  return { ...newNotice, id: newNotice._id.toHexString() }
}

export async function updateNotice(id: string, data: Partial<NoticeData>): Promise<(Notice & { id: string }) | null> {
  const db = await getDatabase()
  const result = await db.collection<Notice>("notices").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  )

  // Verify the update operation
  const verification = verifyMongoDBOperation(result, 'update');
  logVerificationResult(verification, 'Notice update');

  if (!verification.success) {
    console.error(`Failed to update notice with ID ${id}`);
    return null;
  }

  if (!result.value) return null
  return { ...result.value, id: result.value._id.toHexString() }
}

export async function deleteNotice(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Notice>("notices").deleteOne({ _id: new ObjectId(id) })

  // Verify the delete operation
  const verification = verifyMongoDBOperation(result, 'delete');
  logVerificationResult(verification, 'Notice deletion');

  return verification.success;
}

// Document functions

interface DocumentData {
  name: string
  description: string
  fileType: string
  category: string
  fileUrl?: string
  fileSize?: number
  originalName?: string
  uploadDate: string
}

interface Document extends DocumentData {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export async function getDocuments(): Promise<Document[]> {
  const db = await getDatabase()
  const documents = await db.collection<Document>("documents").find({}).toArray()
  console.log(`Retrieved ${documents.length} documents from database`);
  return documents.map(doc => ({
    ...doc,
    id: doc._id.toHexString(),
  }))
}

export async function createDocument(data: DocumentData): Promise<Document> {
  const db = await getDatabase()
  const result = await db.collection<DocumentData>("documents").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Verify the create operation
  const verification = verifyMongoDBOperation(result, 'create');
  logVerificationResult(verification, 'Document creation');

  if (!verification.success) {
    throw new Error(verification.message);
  }

  const newDocument = await db.collection<Document>("documents").findOne({ _id: result.insertedId })
  if (!newDocument) throw new Error("Failed to create document")
  return { ...newDocument, id: newDocument._id.toHexString() }
}

export async function updateDocument(id: string, data: Partial<DocumentData>): Promise<Document | null> {
  const db = await getDatabase()
  const result = await db.collection<Document>("documents").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  )

  // Verify the update operation
  const verification = verifyMongoDBOperation(result, 'update');
  logVerificationResult(verification, 'Document update');

  if (!verification.success) {
    console.error(`Failed to update document with ID ${id}`);
    return null;
  }

  if (!result.value) return null
  return { ...result.value, id: result.value._id.toHexString() }
}

export async function deleteDocument(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Document>("documents").deleteOne({ _id: new ObjectId(id) })

  // Verify the delete operation
  const verification = verifyMongoDBOperation(result, 'delete');
  logVerificationResult(verification, 'Document deletion');

  return verification.success;
}

// Product functions

interface ProductData {
  name: string
  description: string
  price: string
  category: string
  subcategory?: string
  image?: string
  inStock: boolean
  whatsappPhone?: string
}

interface Product extends ProductData {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase()
  const products = await db.collection<Product>("products").find({}).toArray()
  console.log(`Retrieved ${products.length} products from database`);
  return products.map(product => ({
    ...product,
    id: product._id.toHexString(),
  }))
}

export async function createProduct(data: ProductData): Promise<Product & { id: string }> {
  const db = await getDatabase()
  const result = await db.collection<ProductData>("products").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Verify the create operation
  const verification = verifyMongoDBOperation(result, 'create');
  logVerificationResult(verification, 'Product creation');

  if (!verification.success) {
    throw new Error(verification.message);
  }

  const newProduct = await db.collection<Product>("products").findOne({ _id: result.insertedId })
  if (!newProduct) throw new Error("Failed to create product")
  return { ...newProduct, id: newProduct._id.toHexString() }
}

export async function updateProduct(id: string, data: Partial<ProductData>): Promise<(Product & { id: string }) | null> {
  const db = await getDatabase()
  const result = await db.collection<Product>("products").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  )

  // Verify the update operation
  const verification = verifyMongoDBOperation(result, 'update');
  logVerificationResult(verification, 'Product update');

  if (!verification.success) {
    console.error(`Failed to update product with ID ${id}`);
    return null;
  }

  if (!result.value) return null
  return { ...result.value, id: result.value._id.toHexString() }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Product>("products").deleteOne({ _id: new ObjectId(id) })

  // Verify the delete operation
  const verification = verifyMongoDBOperation(result, 'delete');
  logVerificationResult(verification, 'Product deletion');

  return verification.success;
}
