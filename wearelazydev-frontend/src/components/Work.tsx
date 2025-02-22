// import { ArrowBigLeft, ArrowBigRight, ArrowLeft, ArrowRight, CornerRightDown, GitCompare, GitCompareArrows, GitPullRequest, GitPullRequestCreate, GitPullRequestCreateArrow, GitPullRequestDraft } from 'lucide-react'
import {ArrowLeft, ArrowRight, CornerRightDown, GitCompare, GitCompareArrows, GitPullRequest, GitPullRequestCreate, GitPullRequestCreateArrow, GitPullRequestDraft } from 'lucide-react'
import React from 'react'

export default function Work() {
    return (
        <main className='space-y-10'>
            <div className='text-center'>
                <h1 className='text-2xl xl:text-3xl font-semibold mt-10 md:mt-0'>Flow Get Rewarded for Your Pull Requests!</h1>
                <p className='text-sm opacity-70 mt-2'>Submit pull requests and bug fixes and get rewarded for your contributions.</p>
            </div>

            <div className='grid xl:grid-cols-3 gap-5'>
                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium border bg-white text-black dark:bg-secondary dark:text-white  p-5 rounded shadow-lg'><GitPullRequestCreate size={35} />Developer Submits a Pull Request URL</p>
                    <ArrowRight size={35} className='hidden xl:inline-block' />
                </div>
                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium border bg-white text-black dark:bg-secondary dark:text-white  p-5 rounded shadow-lg'><GitPullRequest size={35} />zkTLS Verifies the Pull Request</p>
                    <ArrowRight size={35} className='hidden xl:inline-block' />
                </div>
                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium border bg-white  text-black dark:bg-secondary dark:text-white p-5 rounded shadow-lg'><GitPullRequestCreateArrow size={35} />Repository Owner Reviews and Verifies Code</p>
                    <CornerRightDown size={50} className='hidden xl:inline-block' />
                </div>

                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium xl:bg-primary xl:text-primary-foreground p-5 rounded shadow-md shadow-primary'><GitCompareArrows size={35} />Contributors receive rewards $LAZYDEV</p>
                    <ArrowLeft size={35} className='hidden xl:inline-block' />
                </div>
                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium border bg-white text-black dark:bg-secondary dark:text-white  p-5 rounded shadow-lg'><GitCompare size={35} />ZkTLS verifies the Merge</p>
                    <ArrowLeft size={35} className='hidden xl:inline-block' />
                </div>
                <div className='xl:flex xl:items-center gap-5'>
                    <p className='h-full w-full text-lg font-medium border bg-white text-black dark:bg-secondary dark:text-white  p-5 rounded shadow-lg'><GitPullRequestDraft size={35} />Repository Owner Merges the PR</p>
                    <ArrowLeft size={35} className='hidden xl:inline-block' />
                </div>
            </div>
        </main>
    )
}
