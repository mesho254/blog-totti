import { Outlet } from '@remix-run/react'

function posts() {
    return (
        <>
            <Outlet />
        </>
    )
}

export default posts