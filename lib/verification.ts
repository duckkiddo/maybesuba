/**
 * Utility functions for verifying database and storage operations
 */

/**
 * Verifies if a MongoDB operation was successful
 * @param result The result of the MongoDB operation
 * @param operationType The type of operation (create, update, delete)
 * @returns An object with success status and message
 */
export function verifyMongoDBOperation(result: any, operationType: 'create' | 'update' | 'delete'): { success: boolean; message: string } {
  if (!result) {
    return { 
      success: false, 
      message: `MongoDB ${operationType} operation failed: No result returned` 
    };
  }

  switch (operationType) {
    case 'create':
      if (result.insertedId || (result._id && result.id)) {
        return { 
          success: true, 
          message: `MongoDB ${operationType} operation successful: Document created with ID ${result.insertedId || result._id || result.id}` 
        };
      }
      break;
    case 'update':
      if (result.value || (result.modifiedCount && result.modifiedCount > 0)) {
        return { 
          success: true, 
          message: `MongoDB ${operationType} operation successful: Document updated` 
        };
      }
      break;
    case 'delete':
      if (result.deletedCount && result.deletedCount > 0) {
        return { 
          success: true, 
          message: `MongoDB ${operationType} operation successful: ${result.deletedCount} document(s) deleted` 
        };
      }
      break;
  }

  return { 
    success: false, 
    message: `MongoDB ${operationType} operation failed: Unexpected result format` 
  };
}

/**
 * Verifies if a Cloudinary operation was successful
 * @param result The result of the Cloudinary operation
 * @param operationType The type of operation (upload, delete)
 * @returns An object with success status and message
 */
export function verifyCloudinaryOperation(result: any, operationType: 'upload' | 'delete'): { success: boolean; message: string } {
  if (!result) {
    return { 
      success: false, 
      message: `Cloudinary ${operationType} operation failed: No result returned` 
    };
  }

  switch (operationType) {
    case 'upload':
      if (result.url && result.publicId) {
        return { 
          success: true, 
          message: `Cloudinary ${operationType} operation successful: File uploaded with public ID ${result.publicId}` 
        };
      }
      break;
    case 'delete':
      if (result.result === 'ok') {
        return { 
          success: true, 
          message: `Cloudinary ${operationType} operation successful: File deleted` 
        };
      }
      break;
  }

  return { 
    success: false, 
    message: `Cloudinary ${operationType} operation failed: Unexpected result format` 
  };
}

/**
 * Logs verification results to the console
 * @param verificationResult The result of the verification
 * @param operation The operation being verified
 */
export function logVerificationResult(verificationResult: { success: boolean; message: string }, operation: string): void {
  if (verificationResult.success) {
    console.log(`✅ ${operation} verification: ${verificationResult.message}`);
  } else {
    console.error(`❌ ${operation} verification: ${verificationResult.message}`);
  }
}