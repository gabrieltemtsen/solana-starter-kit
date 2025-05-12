import { ProfilesList } from '@/components/profile/profile-list'
import { SearchBar } from '@/components/search-bar/search-bar'

export default async function Home() {

  return (
    <div className="flex flex-col space-y-4">
      <SearchBar />
      <div className="w-full">
        <h2 className="text-xl mb-3">Profiles</h2>
        <ProfilesList />
      </div>
    </div>
  )
}
