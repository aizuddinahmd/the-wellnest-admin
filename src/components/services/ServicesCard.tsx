"use client";
import React, { useState } from "react";
// import FullScreenModal from '../example/ModalExample/FullScreenModal';
// import FormInModal from '../example/ModalExample/FormInModal';
import { useRouter } from "next/navigation";

// const Categories = [
// 	{ name: 'Massage', items: 1 },
// 	{ name: 'Mat Pilates', items: 3 },
// 	{ name: 'Yoga', items: 2 },
// 	{ name: 'Reformer Pilates', items: 2 },
// ]

export const ServicesCard = () => {
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const router = useRouter();
  const handleOpenModal = (category: string) => {
    setModalCategory(category);
  };

  const handleCloseModal = () => {
    setModalCategory(null);
    setNewClassName("");
  };

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
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Add Service
        </button>
      </div>
    </div>
  );
};
