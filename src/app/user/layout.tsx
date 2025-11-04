"use client";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div lang="en">
            {/* Layout UI */}
            {/* Place children where you want to render a page or nested layout */}
            <main>{children}</main>
        </div>
    )
}