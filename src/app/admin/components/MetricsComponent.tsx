export function MetricsComponent() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-gray-500">+20.1% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Recruiters</h3>
          <div className="text-2xl font-bold">567</div>
          <p className="text-xs text-gray-500">+15.2% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Jobs</h3>
          <div className="text-2xl font-bold">789</div>
          <p className="text-xs text-gray-500">+10.5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Successful Placements</h3>
          <div className="text-2xl font-bold">321</div>
          <p className="text-xs text-gray-500">+5.7% from last month</p>
        </div>
      </div>
    )
  }