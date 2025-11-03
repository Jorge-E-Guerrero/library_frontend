"use client";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div lang="en">
            <h1>Layout home</h1>
            {/* Layout UI */}
            {/* Place children where you want to render a page or nested layout */}
            <main>{children}</main>
        </div>
    )
}