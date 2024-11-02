'use client';
import {useState, useRef, useEffect, ChangeEvent, use} from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function Countdown (){
    const [duration, setDuration] = useState<number | string>('');
    const [timeLeft, setTimeLeft] = useState<number> (0);
    const [isActive, setIsActive] = useState<boolean> (false);
    const [isPaused, setIsPaused] = useState<boolean> (false);
    const timerRef = useRef<NodeJS.Timeout | null> (null);

    const handlSetDuration = () : void => {
        if (typeof duration === 'number' &&  duration >0) {
            setTimeLeft(duration);
            setIsActive(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };
    const handleStart = () : void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };
    const handlePause = () : void => {
        if(isActive) {
            setIsPaused(true);
            setIsActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        
    };
    const handleReset = () : void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(typeof duration === 'number' ? duration : 0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    useEffect (() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 1) {
                        clearInterval(timerRef.current!);
                        //setIsActive(false);
                        return 0;
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isPaused]);

    const formatTime = (time: number) : string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) : void => {
        setDuration(Number(e.target.value) || '');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-purple-300">
           <h1 className="text-8xl font-bold mb-20 text-purple-800 hover:text-purple-900 text-center">
              Countdown Timer
            </h1>
          {/* Timer box container */}
          <div className="bg-purple-400 shadow-lg rounded-[25px] p-8 w-full max-w-screen-md">
            {/* Title of the countdown timer */}
           
            {/* Input and set button container */}
            <div className="flex items-center border-purple-500 border-2 mb-6">
              <Input
                type="number"
                id="duration"
                placeholder="Enter duration in seconds"
                value={duration}
                onChange={handleDurationChange}
                className="flex-1 border-none"
              />
              <Button
                onClick={handlSetDuration}
                variant="outline"
                className="text-purple-900 border-none bg-purple-500 hover:bg-purple-600 hover:text-white"
              >
                Set
              </Button>
            </div>
            {/* Display the formatted time left */}
            <div className="text-9xl font-bold text-gray-200 m-10 text-center">
              {formatTime(timeLeft)}
            </div>
            {/* Buttons to start, pause, and reset the timer */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            variant="outline"
            className="text-purple-800 rounded-[7px] hover:border-2 px-10"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="text-purple-800 rounded-[7px] hover:border-2 px-10"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-purple-800 rounded-[7px] hover:border-2 px-10"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}