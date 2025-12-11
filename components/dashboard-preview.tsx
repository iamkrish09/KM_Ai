"use client"

import React from "react"

export function DashboardPreview() {
  React.useEffect(() => {
    // Inject UnicornStudio script if not already present
    if (!(window as any).UnicornStudio) {
      ;(window as any).UnicornStudio = { isInitialized: false }
      const s = document.createElement("script")
      s.type = "text/javascript"
      s.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.35/dist/unicornStudio.umd.js"
      s.onload = function () {
        if (!(window as any).UnicornStudio.isInitialized) {
          try {
            ;(window as any).UnicornStudio.init()
            ;(window as any).UnicornStudio.isInitialized = true
          } catch (e) {
            console.error("UnicornStudio init failed", e)
          }
        }
      }
      ;(document.head || document.body).appendChild(s)
    } else {
      // If script is present but not initialized, try initializing
      try {
        if (!(window as any).UnicornStudio.isInitialized && (window as any).UnicornStudio.init) {
          ;(window as any).UnicornStudio.init()
          ;(window as any).UnicornStudio.isInitialized = true
        }
      } catch (e) {
        console.error("UnicornStudio init failed", e)
      }
    }
  }, [])

  return (
    <div className="w-[calc(100vw-32px)] md:w-[1160px]">
      {/* <div className="bg-primary-light/50 rounded-2xl p-2 shadow-2xl"> */}
        {/*
          Unicorn Studio embed placeholder. The original embed sets fixed width/height;
          here we make it responsive via Tailwind classes. The data-us-project attribute
          is required by UnicornStudio to load the project.
        */}
        <div className="w-full h-[420px] md:h-[700px] lg:h-[900px] rounded-xl overflow-hidden shadow-lg">
          <div
            // data-us-project="1KxWMcdfnPVWgO04ZR5C"
            data-us-project="jvVkhTWWk801BTFB9Uef"
            style={{ width: "100%", height: "100%" }}
          />

          {/*
            Previous static Image fallback (commented out). Uncomment to restore the
            original dashboard-preview.png placeholder if needed.

            <Image
              src="/images/dashboard-preview.png"
              alt="Dashboard preview"
              width={1160}
              height={700}
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          */}
        {/* </div> */}
        
      </div>
    </div>
  )
}
