'use client'
import { useRouter } from 'next/navigation'
import { Modal } from '@/src/components/modal'
import Page from "../../[id]/page";

export default function PageModal({ children }: { children: React.ReactNode }) {
    return (
        <Modal config={{ title: "Book Details" }} data={{}}>
            <Page isModal="true" />
        </Modal>
    )
}