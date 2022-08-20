import bcrypt from 'bcrypt'
import { db } from './db.server'
import { createCookieSessionStorage, redirect } from '@remix-run/node'


export async function login({ username, password }) {
    const user = await db.user.findUnique({
        where: {
            username
        }
    })
    if (!user) return null
    //check passowrd
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isCorrectPassword) return null

    return user
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error('No session secret')
}
//create session storage
const storage = createCookieSessionStorage({
    cookie: {
        name: 'my-first blog_session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 60,
        httpOnly: true,
    },
})

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession()
    session.set('userId', userId)
    return redirect(redirectTo, {
        headers: {
            'Set_cookie': await storage.commitSession(session)
        },
    })
}
//get user session
export function getUserSession(request: Request) {
    return storage.getSession(request.headers.get('Cookie'))
}

// get logged in user
export async function getUser(request: Request) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') {
        return null
    }


    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        })
        return user
    } catch (error) {
        return null
    }
}