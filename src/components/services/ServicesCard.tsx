"use client";
import React, { useState, useEffect } from "react";
// import FullScreenModal from '../example/ModalExample/FullScreenModal';
// import FormInModal from '../example/ModalExample/FormInModal';
import { useRouter } from "next/navigation";

// const Categories = [
// 	{ name: 'Massage', items: 1 },
// 	{ name: 'Mat Pilates', items: 3 },
// 	{ name: 'Yoga', items: 2 },
// 	{ name: 'Reformer Pilates', items: 2 },
// ]

interface Course {
  id: string;
  title: string;
  price: number;
  category: string;
}

export const ServicesCard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/course");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // const handleClassCreate = (e: React.FormEvent) => {
  // 	e.preventDefault()
  // 	// TODO: Replace with actual create logic
  // 	console.log('Create class:', newClassName, 'for', modalCategory)
  // 	handleCloseModal()
  // }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Services
        </h3>
        <button
          onClick={() => router.push("/services/create-services")}
          className="rounded-md bg-[#355c4a] hover:bg-[#355c4a]/80 px-4 py-2 text-white"
        >
          Add Service
        </button>
      </div>
      {/* Courses Table */}
      <div className="mt-8">
        <h4 className="mb-4 text-base font-semibold text-gray-700 dark:text-white/80">Available Courses</h4>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-2 text-gray-800 dark:text-white/90">{course.title}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white/80">RM {course.price}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white/80">{course.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {courses.length === 0 && (
              <div className="py-8 text-center text-gray-500">No courses found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
