import { Link, useActionData } from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import { db } from '~/utils/db.server'

function validateTitle(title) {
    if (typeof title !== 'string' || title.length < 3) {
        return 'title should be atleast 3 char long'
    }
}
function validateBody(body) {
    if (typeof body !== 'string' || body.length < 3) {
        return 'body should be atleast 3 char long'
    }
}
function badRequest(data) {
    return json(data, { status: 400 })
}

export const action = async ({ request }) => {
    const form = await request.formData()
    const title = form.get('title')
    const body = form.get('body')
    const fields = { title, body }

    const fieldErrors = {
        title: validateTitle(title),
        body: validateBody(body),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        // console.log(fieldErrors)
        return badRequest({ fieldErrors, fields })
    }
    // console.log(fields)

    // @todo submit to database
    const post = await db.post.create({ data: fields })

    return redirect(`/posts/${post.id}`)
}

function NewPost() {
    const actionData = useActionData()

    return (
        <>
            <div className='page-header'>
                <h1>New post</h1>
                <Link to='/posts' className='btn btn-reverse'>
                    Back
                </Link>
            </div>
            <div className='page-content'>
                <form method='POST'>
                    <div className="form-control">
                        <label htmlFor='title'>Title</label>
                        <input type='text' name='title' id='title' defaultValue={actionData?.fieldErrors?.fields} />
                        <div className="error">
                            <p>{actionData?.fieldErrors?.title && (actionData?.fieldErrors?.title)}</p>
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor='body'>Post Body</label>
                        <textarea name='body' id='body' defaultValue={actionData?.fieldErrors?.fields} />
                        <div className="error">
                            <p>{actionData?.fieldErrors?.body && (actionData?.fieldErrors?.body)}</p>
                        </div>
                    </div>
                    <button type='submit' className='btn btn-block'>
                        Add Post
                    </button>
                </form>
            </div>
        </>
    )
}

export default NewPost