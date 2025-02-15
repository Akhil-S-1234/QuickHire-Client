import RecruiterProfileForm from '../components/Register'

export default function Users() {

    return (
        <>
            <header className="bg-white text-gray-800 p-4 shadow z-10">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-3xl font-black">
                        Quick<span className="text-[#5D5FEF] font-black">H</span>ire
                    </h1>
                </div>
            </header>
            <RecruiterProfileForm />
        </>
    )
    return
}