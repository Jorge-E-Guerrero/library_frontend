'use client'
import { useRouter } from 'next/navigation'
import { Modal } from '@/src/components/modal'
import Page from "../../[id]/page";

export default function PageModal({ children }: { children: React.ReactNode }) {

    console.log("Rendering Book Modal Page");

    return (
        <Modal config={{ title: "Book Details" }} data={{}}>
            <Page />
        </Modal>
    )
}