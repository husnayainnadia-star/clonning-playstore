
import { Suspense } from "react";
import HomepageContent from "@/components/home/HomepageContent";
import HomeSkeleton from "@/components/home/HomeSkeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomepageContent />
    </Suspense>
  );
}
