"use client";

import "./report.css";

export default function HomeLayout({
    children,
    availableBooksWithAuthor,
    monthlyLoansAndReturns,
    membersWithDebt,
    mostLoanedBooks,
    topGenres,

}: {
    children: React.ReactNode,
    availableBooksWithAuthor?: React.ReactNode,
    monthlyLoansAndReturns?: React.ReactNode,
    membersWithDebt?: React.ReactNode
    mostLoanedBooks?: React.ReactNode,
    topGenres?: React.ReactNode,
}) {
    return (
        <>
            <div className="reports-layout">
                {children}
                {availableBooksWithAuthor}
                {monthlyLoansAndReturns}
                {membersWithDebt}
                {mostLoanedBooks}
                {topGenres}
            </div>
        </>
    )
}