"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useAttendance } from "../context/attendance-context";
import { Guest } from "@/types/schema/Guest.schema";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestFound: (guest: Guest) => void;
}

export function QRScanner({ isOpen, onClose, onGuestFound }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actions } = useAttendance();
  const controlsRef = useRef<IScannerControls | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      // Wait for video element to be mounted and visible
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (videoRef.current) {
        const codeReader = new BrowserQRCodeReader();
        controlsRef.current = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, async (result, err, controls) => {
          if (result) {
            // Stop scanning after a successful scan
            controls.stop();
            setIsScanning(false);
            await handleQRCodeDetected(result.getText());
          }
          if (err && !(err instanceof DOMException)) {
            // Only show error if it's not just "no QR code found"
            // console.error(err);
          }
        });
      } else {
        setError("Camera not found. Please ensure your device has a camera and try again.");
        setIsScanning(false);
        console.error("QRScanner: videoRef.current is null");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err && err.name === "NotAllowedError") {
        setError("Camera access was denied. Please allow camera access in your browser settings.");
        toast.error("Camera access denied");
      } else if (err && err.name === "NotFoundError") {
        setError("No camera device found. Please connect a camera and try again.");
        toast.error("No camera found");
      } else {
        setError("Unable to access camera. Please check permissions and device settings.");
        toast.error("Unable to access camera");
      }
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeDetected = async (token: string) => {
    try {
      const guest = await actions.getGuestByToken(token);
      if (guest) {
        onGuestFound(guest);
        stopCamera();
        onClose();
        toast.success(`Found guest: ${guest.first_name} ${guest.last_name}`);
      } else {
        toast.error("Invalid QR code or guest not found");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Error processing QR code");
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl h-[80vh] max-h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
            Scan Guest QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
              <Button onClick={startCamera} variant="outline" className="w-full sm:w-auto">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex-1 relative flex flex-col">
              <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Scanner overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-white rounded-lg p-2">
                      <div className="w-32 h-32 sm:w-48 sm:h-48 border-2 border-white rounded-lg relative">
                        <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-blue-500"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-blue-500"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-blue-500"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-blue-500"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">Position the QR code within the frame to scan</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {isScanning && (
              <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Scanning...</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
