import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/Sidemenu.tsx";
import { Toaster } from "../components/ui/toaster"

const AppLayout: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Function to prevent pull-to-refresh only when at the top of the page
        // and only for vertical pulls (allowing horizontal navigation)
        const preventPullToRefresh = (e: TouchEvent) => {
            // Only prevent default if we're at the top of the page and pulling down
            if (document.scrollingElement?.scrollTop === 0 && e.touches[0].clientY > 0) {
                // Check if this is a vertical pull (not a horizontal swipe)
                const touchStartY = e.touches[0].clientY;
                
                // Add a move handler to check direction
                const handleTouchMove = (moveEvent: TouchEvent) => {
                    const touchY = moveEvent.touches[0].clientY;
                    
                    // If pulling down (increasing Y value) and at top, prevent default
                    if (touchY > touchStartY + 5) { // Add a small threshold to detect intentional pull
                        moveEvent.preventDefault();
                    }
                    
                    // Remove this handler after first move
                    document.removeEventListener('touchmove', handleTouchMove);
                };
                
                // Add the move handler
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
            }
        };

        // Only add the touchstart listener
        document.addEventListener("touchstart", preventPullToRefresh, { passive: true });
        
        // Apply CSS for overscroll behavior but in a way that allows normal navigation
        document.body.style.overscrollBehaviorY = "none"; // Only prevent vertical overscroll
        
        return () => {
            document.removeEventListener("touchstart", preventPullToRefresh);
            document.body.style.overscrollBehaviorY = "";
        }
    }, []);

    useEffect(() => {
        // Check if device is mobile/tablet
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // 1024px is typical tablet breakpoint
        };
        
        // Initial check
        checkMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkMobile);
        
        // Check sidebar collapsed state from localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
        if (sidebarCollapsed) {
            setIsSidebarCollapsed(sidebarCollapsed === 'true');
        }
        
        // Add event listener for sidebar collapse changes
        const handleStorageChange = () => {
            const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            setIsSidebarCollapsed(collapsed);
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="overflow-x-hidden">
            {/* Sidebar or top navbar based on screen size */}
            <SidebarMenu />
            
            {/* Main content */}
            <div className="flex h-screen">
                <div className={`flex-1 ${isMobile ? 'mt-16 ml-0' : isSidebarCollapsed ? 'ml-16' : 'ml-64'} p-4 transition-all duration-300`}>
                    <Outlet/>
                    <Toaster/>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;