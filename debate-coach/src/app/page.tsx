'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 z-0"></div>
        <div className="absolute inset-0 opacity-30 dark:opacity-10 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.3),transparent)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">AI-Powered</span> Debate Training
              </h1>
              <p className="text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-xl">
                Elevate your debate skills with personalized feedback, AI-generated cases, and expert analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link href="/dashboard" className="btn-primary text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="btn-primary text-center">
                      Get Started Free
                    </Link>
                    <Link href="/login" className="btn-secondary text-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100 dark:bg-blue-900/30 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span> for Debate Excellence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to take your debate skills to the next level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            <div className="card">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Speech Recording & Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Record your speeches, get them transcribed, and receive detailed feedback on content, delivery, and structure.
              </p>
              <Link href={user ? "/speech" : "/login?redirectedFrom=/speech"} className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                Try it now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Case Generator</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate structured debate cases with ARES points for any topic, backed by research and evidence.
              </p>
              <Link href={user ? "/case-generator" : "/login?redirectedFrom=/case-generator"} className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                Generate a case
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="card">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track your improvement over time with detailed analytics and personalized recommendations.
              </p>
              <Link href={user ? "/dashboard" : "/login?redirectedFrom=/dashboard"} className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                View dashboard
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="w-full py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Debate Champions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Jamie Davis</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">State Debate Champion</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The AI case generator saved me hours of research time. I was able to focus on delivery and strategy instead of spending all my time on case construction."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                  SR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Debate Coach</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "I use Debate Coach with all my students. The speech feedback is incredibly detailed and helps them improve much faster than traditional coaching methods alone."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                  MT
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Thompson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Novice Debater</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a beginner, I was intimidated by debate. This platform made it accessible and helped me build confidence through structured practice and feedback."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Debate Skills?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of debaters who are using AI to reach their full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all shadow-md hover:shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-all shadow-md hover:shadow-lg">
                  Get Started Free
                </Link>
                <Link href="/login" className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-all">
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
