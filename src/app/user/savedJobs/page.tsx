import { Suspense } from 'react';
import SavedJobsList from '../components/SavedJobs';
import Header from '../../../components/Header'

// import HeroSection from './hero-section';
// import SkeletonLoader from './skeleton-loader';

export default function SavedJobsPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Saved Jobs</h1>
          {/* <Suspense fallback={<SkeletonLoader />}> */}
          <SavedJobsList />
          {/* </Suspense> */}
        </div>
      </div>
    </>

  );
}

