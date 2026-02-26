import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AnalyzePage } from '@/pages/AnalyzePage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: 'analyze',
                element: <AnalyzePage />,
            },
        ],
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}
