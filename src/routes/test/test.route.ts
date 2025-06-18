import { deleteAllUsers, updateUserStatusByEmail } from '@src/db/users'
import { appError } from '@src/lib/errors/app-error'
import { Hono } from 'hono'

export const testRoute = new Hono()

testRoute.get('/', async (content) => {
  const response = {
    message: 'Test route is working!',
    routes: [
      { method: 'GET', path: '/test' },
      { method: 'POST', path: '/test/change-status' },
    ],
  }
  return content.json(response)
})

testRoute.post('/change-status', async (content) => {
  const { email, status } = await content.req.json()
  if (!email || !status) {
    throw appError('validation/failed', 'Email and status are required', 400)
  }
  const response = await updateUserStatusByEmail(email, status)
  if (response.length === 0) {
    throw new Error('User not found')
  }
  return content.json(
    { message: 'User verified successfully', user: response[0] },
    200,
  )
})

testRoute.post('/clear-users', async (context) => {
  try {
    const deletedUsers = await deleteAllUsers()

    return context.json(
      { message: `${deletedUsers.length} users deleted successfully` },
      200,
    )
  } catch (error) {
    console.error('Error deleting users:', error)

    throw appError('internal/server-error', 'Failed to delete users', 500)
  }
})
