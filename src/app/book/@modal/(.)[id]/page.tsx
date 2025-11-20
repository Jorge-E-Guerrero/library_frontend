'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Modal } from '@/src/components/modal'
import Page from "../../[id]/page";

export default function PageModal({ children }: { children: React.ReactNode }) {

    const [reddirect, setRedirect] = useState(false);

    return (
        <Modal reddirect={reddirect} config={{ title: "Book Details" }} data={{}}>
            <Page setRedirect={setRedirect} isModal="true" />
        </Modal>
    )
}