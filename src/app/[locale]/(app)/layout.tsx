/* eslint-disable @typescript-eslint/no-explicit-any */
import MainWrapper from '@/components/wrapper/MainWrapper'
import React from 'react'
// Trigger layout rebuild to reload translations

const layout = async ({ children, params }: { children: React.ReactNode, params?: Promise<any> }) => {
  if (params) await params;
  return (
    <MainWrapper>
      {children}
    </MainWrapper>
  )
}

export default layout
