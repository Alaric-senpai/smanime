  export const formatDuration = (duration: string) => {
    return duration.replace("min", "minutes")
  }

  export const getStatusColor = (status: string, airing: boolean) => {
    if (airing) return "bg-green-500"
    if (status === "Finished Airing") return "bg-blue-500"
    if (status === "Not yet aired") return "bg-yellow-500"
    return "bg-gray-500"
  }