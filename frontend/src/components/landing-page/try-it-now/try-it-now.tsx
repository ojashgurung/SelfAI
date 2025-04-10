import { Button } from "@/components/ui/button";

export function TryItNow() {
  return (
    <div className="mx-auto max-w-container" id="waitlist">
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-600 to-purple-600 text-white p-20 rounded-3xl relative flex gap-2 justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300">TRY IT NOW</span>

          <div className="mt-4 max-w-md">
            <h2 className="text-4xl font-semibold leading-tight mb-4">
              Make every interaction count — even after it ends.
            </h2>
            <p className="text-gray-300 text-lg">
              Join SelfAI and turn casual connections into lasting impressions —
              share your story, skills, and vision even after the handshake.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center sm:flex-row gap-4 max-w-xl">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-base outline-none focus:ring-2 focus:ring-black/70"
            />
          </div>
          <Button
            size="lg"
            className="bg-white text-indigo-600 hover:bg-white/90 whitespace-nowrap text-base"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
}
