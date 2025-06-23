import { useState, useEffect } from 'react'
import type { AdminDashboardState, ActivityLog } from '../types/admin'

// Import initial data
import initialProducts from '@/data/products.json'
import initialDocuments from '@/data/documents.json'
import initialNotices from '@/data/notices.json'
import initialFactories from '@/data/factories.json'
import initialCarouselData from '@/data/carousel.json'
import initialMediaData from '@/data/initial-media.json'
import initialTeamData from '@/data/initial-team.json'

export function useAdminData() {
  const [state, setState] = useState<AdminDashboardState>({
    products: [],
    documents: [],
    notices: [],
    factories: [],
    mailSubmissions: [],
    mediaItems: [],
    carouselSlides: [],
    activityLogs: [],
    teamMembers: []
  })

  const adminUsername = sessionStorage.getItem("adminUsername") || "Admin"

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Fetch products from API
      const productsResponse = await fetch('/api/products')
      const productsData = await productsResponse.json()
      const products = productsData.success ? productsData.products : initialProducts

      // Fetch documents from API
      const documentsResponse = await fetch('/api/documents')
      const documentsData = await documentsResponse.json()
      const documents = documentsData.success ? documentsData.documents : initialDocuments

      // Fetch notices from API
      const noticesResponse = await fetch('/api/notices')
      const noticesData = await noticesResponse.json()
      const notices = noticesData.success ? noticesData.notices : initialNotices

      // For other data types that might not have API endpoints yet, fallback to localStorage
      const savedFactories = localStorage.getItem("factories")
      const savedMailSubmissions = localStorage.getItem("mailSubmissions")
      const savedMediaItems = localStorage.getItem("mediaItems")
      const savedCarousel = localStorage.getItem("carousel")
      const savedActivityLogs = localStorage.getItem("activityLogs")
      const savedTeamMembers = localStorage.getItem("teamMembers")

      // Load media items with preset data if none exist
      const mediaItems = savedMediaItems ? JSON.parse(savedMediaItems) : initialMediaData
      const updatedMediaItems = mediaItems.map((item: any) => {
        if (!item.displayIn) {
          if (item.type === "image") {
            return { ...item, displayIn: ["gallery"] }
          } else if (item.type === "video") {
            return { ...item, displayIn: ["videos"] }
          }
        }
        return item
      })

      // Save the initial media data if it doesn't exist
      if (!savedMediaItems) {
        localStorage.setItem("mediaItems", JSON.stringify(updatedMediaItems))
      }

      setState({
        products,
        documents,
        notices,
        factories: savedFactories ? JSON.parse(savedFactories) : initialFactories,
        mailSubmissions: savedMailSubmissions ? JSON.parse(savedMailSubmissions) : [],
        mediaItems: updatedMediaItems,
        carouselSlides: savedCarousel ? JSON.parse(savedCarousel) : initialCarouselData,
        activityLogs: savedActivityLogs ? JSON.parse(savedActivityLogs) : [],
        teamMembers: savedTeamMembers ? JSON.parse(savedTeamMembers) : initialTeamData,
      })

      const handleMailUpdate = () => {
        const updatedMail = localStorage.getItem("mailSubmissions")
        if (updatedMail) {
          setState(prev => ({ ...prev, mailSubmissions: JSON.parse(updatedMail) }))
        }
      }

      window.addEventListener("mailSubmissionsUpdated", handleMailUpdate)
      return () => window.removeEventListener("mailSubmissionsUpdated", handleMailUpdate)
    } catch (error) {
      console.error("Error loading data:", error)
      // Fallback to localStorage if API calls fail
      loadFromLocalStorage()
    }
  }

  const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem("products")
    const savedDocuments = localStorage.getItem("documents")
    const savedNotices = localStorage.getItem("notices")
    const savedFactories = localStorage.getItem("factories")
    const savedMailSubmissions = localStorage.getItem("mailSubmissions")
    const savedMediaItems = localStorage.getItem("mediaItems")
    const savedCarousel = localStorage.getItem("carousel")
    const savedActivityLogs = localStorage.getItem("activityLogs")
    const savedTeamMembers = localStorage.getItem("teamMembers")

    setState({
      products: savedProducts ? JSON.parse(savedProducts) : initialProducts,
      documents: savedDocuments ? JSON.parse(savedDocuments) : initialDocuments,
      notices: savedNotices ? JSON.parse(savedNotices) : initialNotices,
      factories: savedFactories ? JSON.parse(savedFactories) : initialFactories,
      mailSubmissions: savedMailSubmissions ? JSON.parse(savedMailSubmissions) : [],
      mediaItems: savedMediaItems ? JSON.parse(savedMediaItems) : initialMediaData,
      carouselSlides: savedCarousel ? JSON.parse(savedCarousel) : initialCarouselData,
      activityLogs: savedActivityLogs ? JSON.parse(savedActivityLogs) : [],
      teamMembers: savedTeamMembers ? JSON.parse(savedTeamMembers) : initialTeamData,
    })
  }

  const logActivity = (action: string, module: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
      user: adminUsername,
    }

    const updatedLogs = [newLog, ...state.activityLogs].slice(0, 100)
    setState(prev => ({ ...prev, activityLogs: updatedLogs }))
    localStorage.setItem("activityLogs", JSON.stringify(updatedLogs))
  }

  const updateProducts = async (products: any[]) => {
    setState(prev => ({ ...prev, products }))

    // Also update localStorage as a fallback
    localStorage.setItem("products", JSON.stringify(products))

    // Notify other components about the update
    window.dispatchEvent(new CustomEvent("productsUpdated"))

    // For newly added or updated products, send to API
    for (const product of products) {
      if (product._id) {
        // Update existing product
        try {
          await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          })
        } catch (error) {
          console.error('Error updating product:', error)
        }
      } else if (product.isNew) {
        // Add new product
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          })
          const data = await response.json()
          if (data.success && data.product) {
            // Update the local state with the new ID
            setState(prev => ({
              ...prev,
              products: prev.products.map(p => 
                p === product ? { ...data.product } : p
              )
            }))
          }
        } catch (error) {
          console.error('Error adding product:', error)
        }
      }
    }
  }

  const updateDocuments = async (documents: any[]) => {
    setState(prev => ({ ...prev, documents }))

    // Also update localStorage as a fallback
    localStorage.setItem("documents", JSON.stringify(documents))

    // Notify other components about the update
    window.dispatchEvent(new CustomEvent("documentsUpdated"))

    // For newly added or updated documents, send to API
    for (const document of documents) {
      if (document._id) {
        // Update existing document
        try {
          await fetch('/api/documents', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document)
          })
        } catch (error) {
          console.error('Error updating document:', error)
        }
      } else if (document.isNew) {
        // Add new document
        try {
          const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(document)
          })
          const data = await response.json()
          if (data.success && data.document) {
            // Update the local state with the new ID
            setState(prev => ({
              ...prev,
              documents: prev.documents.map(d => 
                d === document ? { ...data.document } : d
              )
            }))
          }
        } catch (error) {
          console.error('Error adding document:', error)
        }
      }
    }
  }

  const updateNotices = async (notices: any[]) => {
    setState(prev => ({ ...prev, notices }))

    // Also update localStorage as a fallback
    localStorage.setItem("notices", JSON.stringify(notices))

    // Notify other components about the update
    window.dispatchEvent(new CustomEvent("noticesUpdated"))

    // For newly added or updated notices, send to API
    for (const notice of notices) {
      if (notice._id) {
        // Update existing notice
        try {
          await fetch('/api/notices', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notice)
          })
        } catch (error) {
          console.error('Error updating notice:', error)
        }
      } else if (notice.isNew) {
        // Add new notice
        try {
          const response = await fetch('/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notice)
          })
          const data = await response.json()
          if (data.success && data.notice) {
            // Update the local state with the new ID
            setState(prev => ({
              ...prev,
              notices: prev.notices.map(n => 
                n === notice ? { ...data.notice } : n
              )
            }))
          }
        } catch (error) {
          console.error('Error adding notice:', error)
        }
      }
    }
  }

  const updateFactories = (factories: any[]) => {
    setState(prev => ({ ...prev, factories }))
    localStorage.setItem("factories", JSON.stringify(factories))
    window.dispatchEvent(new CustomEvent("factoriesUpdated"))
  }

  const updateMailSubmissions = (mailSubmissions: any[]) => {
    setState(prev => ({ ...prev, mailSubmissions }))
    localStorage.setItem("mailSubmissions", JSON.stringify(mailSubmissions))
    window.dispatchEvent(new CustomEvent("mailSubmissionsUpdated"))
  }

  const updateMediaItems = (mediaItems: any[]) => {
    setState(prev => ({ ...prev, mediaItems }))
    localStorage.setItem("mediaItems", JSON.stringify(mediaItems))
    window.dispatchEvent(new CustomEvent("mediaItemsUpdated"))
  }

  const updateCarouselSlides = (carouselSlides: any[]) => {
    setState(prev => ({ ...prev, carouselSlides }))
    localStorage.setItem("carousel", JSON.stringify(carouselSlides))
    window.dispatchEvent(new CustomEvent("carouselUpdated"))
  }

  const updateTeamMembers = (teamMembers: any[]) => {
    setState(prev => ({ ...prev, teamMembers }))
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers))
    window.dispatchEvent(new CustomEvent("teamMembersUpdated"))
  }

  // Add explicit delete functions for products, documents, and notices
  const deleteProduct = async (productId: string) => {
    try {
      // Delete from API
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // Update local state
        const updatedProducts = state.products.filter(product => product._id !== productId)
        setState(prev => ({ ...prev, products: updatedProducts }))

        // Update localStorage as fallback
        localStorage.setItem("products", JSON.stringify(updatedProducts))

        // Notify other components
        window.dispatchEvent(new CustomEvent("productsUpdated"))

        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      // Delete from API
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // Update local state
        const updatedDocuments = state.documents.filter(document => document._id !== documentId)
        setState(prev => ({ ...prev, documents: updatedDocuments }))

        // Update localStorage as fallback
        localStorage.setItem("documents", JSON.stringify(updatedDocuments))

        // Notify other components
        window.dispatchEvent(new CustomEvent("documentsUpdated"))

        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting document:', error)
      return false
    }
  }

  const deleteNotice = async (noticeId: string) => {
    try {
      // Delete from API
      const response = await fetch(`/api/notices?id=${noticeId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // Update local state
        const updatedNotices = state.notices.filter(notice => notice._id !== noticeId)
        setState(prev => ({ ...prev, notices: updatedNotices }))

        // Update localStorage as fallback
        localStorage.setItem("notices", JSON.stringify(updatedNotices))

        // Notify other components
        window.dispatchEvent(new CustomEvent("noticesUpdated"))

        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting notice:', error)
      return false
    }
  }

  return {
    ...state,
    logActivity,
    updateProducts,
    updateDocuments,
    updateNotices,
    updateFactories,
    updateMailSubmissions,
    updateMediaItems,
    updateCarouselSlides,
    updateTeamMembers,
    deleteProduct,
    deleteDocument,
    deleteNotice,
    adminUsername
  }
}
