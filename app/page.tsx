import data from '@/data.json';  // Import your JSON data
import HeatMap from '@/components/HeatMap';
import { DataStructure } from '@/lib/types';  // Import the interfaces

export default function Home() {
  // Cast the imported data to the DataStructure type
  const typedData = data as DataStructure;

  // Combine points from all detections into one array
  //const combinedPoints = typedData.detections.flatMap(detection => detection.points);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeatMap data={typedData.detections} />
    </main>
  );
}
