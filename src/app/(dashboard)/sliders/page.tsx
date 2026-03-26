// Is file ka path hoga: src/app/(dashboard)/sliders/page.tsx

import React from 'react';
import SliderManagement from '@/components/dashboard/SliderManagement';

export default function SlidersPage() {
    return (
        <section className="w-full h-full p-4">
            {/* 🚀 Aapka component yahan call ho raha hai */}
            <SliderManagement />
        </section>
    );
}