import JobPostingForm from '../components/JobPostingForm'
import Header from "../components/Header"


export default function PostJobPage() {
    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-100 py-12">

                <JobPostingForm />
            </div>

        </>
    )
}