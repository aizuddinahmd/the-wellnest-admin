'use client'
import React from 'react'
interface TabContentProps {
  id: string
  title: string
  isActive: boolean
  children: React.ReactNode
}

export const TabContent: React.FC<TabContentProps> = ({
  //   title,
  isActive,
  children,
}) => {
  if (!isActive) return null

  return <div>{children}</div>
}
