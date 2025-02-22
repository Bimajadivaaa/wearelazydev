'use client';
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerIssueProps {
    deadline: number | bigint;
}

const TimerIssue = ({ deadline }: TimerIssueProps) => {
    const [timeLeft, setTimeLeft] = useState<string>('Loading...');
    const [progress, setProgress] = useState<number>(0);
    
    // Format deadline date
    const formatDeadlineDate = (timestamp: number | bigint) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const calculateTimeLeftAndProgress = () => {
            const now = Math.floor(Date.now() / 1000); // Current time in seconds
            const deadlineInSeconds = typeof deadline === 'bigint' ? 
                Number(deadline) : deadline;

            // Calculate time remaining
            const timeRemaining = deadlineInSeconds - now;
            
            if (timeRemaining <= 0) {
                setTimeLeft('Expired');
                setProgress(100);
                return;
            }

            // Calculate hours, minutes, seconds
            const hours = Math.floor(timeRemaining / 3600);
            const minutes = Math.floor((timeRemaining % 3600) / 60);
            const seconds = timeRemaining % 60;

            // Format time string
            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeLeft(timeString);

            // Calculate progress
            const totalDuration = deadlineInSeconds - now + timeRemaining;
            const elapsedTime = timeRemaining;
            const progressPercentage = ((totalDuration - elapsedTime) / totalDuration) * 100;
            setProgress(Math.min(progressPercentage, 100));
        };

        // Calculate immediately and then set up interval
        calculateTimeLeftAndProgress();
        const interval = setInterval(calculateTimeLeftAndProgress, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [deadline]);

    return (
        <main className="space-y-2">
            <p className="text-sm text-center font-bold">Deadline: {formatDeadlineDate(deadline)}</p>
            <div className="relative flex items-center justify-center">
                <Progress value={progress} className="h-10" />
                <p className="flex items-center gap-2 absolute text-primary-foreground font-bold">
                    <Timer /> {timeLeft}
                </p>
            </div>
        </main>
    );
};

export default TimerIssue;