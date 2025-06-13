import { db } from '@src/db'
import { roles } from '@src/db/schema'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

export const testRoute = new Hono()

testRoute.get('/', async content => {
  try {
    const response = {
      message: 'Test route is working!',
      routes: [
        { method: 'GET', path: '/test' },
        { method: 'GET', path: '/test/roles' },
        { method: 'POST', path: '/test/assign-role' }
      ]
    }
    return content.json(response)
  } catch (error) {
    console.error('Error in test route:', error)
    return content.json({ message: 'Internal Server Error' }, 500)
  }
})

testRoute.get('/roles', async content => {
  try {
    const allRoles = await db.select().from(roles)
    return content.json({ roles: allRoles }, 200)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return content.json({ message: 'Internal Server Error' }, 500)
  }
})

testRoute.post('/assign-role', async content => {
  const { name } = await content.req.json()

  try {
    const [role] = await db
      .insert(roles)
      .values({
        name
      })
      .returning()

    return content.json({ role }, 201)
  } catch (error) {
    console.error('Error assigning role:', error)
    return content.json({ message: 'Internal Server Error' }, 500)
  }
})

testRoute.post('/remove-role', async content => {
  const { roleId } = await content.req.json()

  try {
    await db.delete(roles).where(eq(roles.id, roleId))
    return content.json({ message: 'Role removed successfully' }, 200)
  } catch (error) {
    console.error('Error removing role:', error)
    return content.json({ message: 'Internal Server Error' }, 500)
  }
})
