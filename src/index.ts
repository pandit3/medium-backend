import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()
  console.log(body)

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      }
    })

    const token = await sign({
      id: user.id,
      email: user.email
      // @ts-ignore
    }, c.env.JWT_SECRET)

    return c.json({
      jwt: token
    })
  } catch (error) {
    // @ts-ignore
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/v1/signin', (c) => {
  return c.text('signin')
})

app.post('/api/v1/blog', (c) => {
  return c.text('blog')
})

app.put('/api/v1/blog', (c) => {
  return c.text('update blog')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('get specific blog')
})

export default app
