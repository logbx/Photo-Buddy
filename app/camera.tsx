import { useRef, useState, useEffect } from "react";
import { View, Text, Image, Alert, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Pause, Play, RotateCcw, Check } from "lucide-react-native";

import { useProjectStore } from "@/stores/projectStore";
import { useGuidanceStore } from "@/stores/guidanceStore";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { useRealtimeAnalysis } from "@/hooks/useRealtimeAnalysis";
import { saveImage } from "@/services/storage";
import { GuidanceOverlay } from "@/components/camera/GuidanceOverlay";
import { CaptureButton } from "@/components/camera/CaptureButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { IconButton } from "@/components/ui/IconButton";
import { Attempt } from "@/types/project";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const {
    currentReferenceUri,
    currentAnalysis,
    setCurrentAnalysis,
    createProject,
    addAttempt,
    currentProjectId,
  } = useProjectStore();

  const { guidance, isPaused, togglePause, reset: resetGuidance } = useGuidanceStore();

  const { analyze, isAnalyzing: isAnalyzingReference, error: analysisError } =
    useImageAnalysis();

  // Real-time analysis hook
  useRealtimeAnalysis(
    cameraRef,
    currentReferenceUri,
    currentAnalysis,
    isCameraReady && !!currentAnalysis
  );

  // Analyze reference image on mount
  useEffect(() => {
    if (currentReferenceUri && !currentAnalysis) {
      analyze(currentReferenceUri).then((result) => {
        if (result) {
          setCurrentAnalysis(result);
        }
      });
    }
  }, [currentReferenceUri, currentAnalysis, analyze, setCurrentAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetGuidance();
    };
  }, [resetGuidance]);

  // Handle no reference image
  if (!currentReferenceUri) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg mb-4">No reference image selected</Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Handle permissions
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <LoadingSpinner message="Checking camera permissions..." />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-8">
        <Text className="text-white text-lg text-center mb-4">
          Camera permission is required to use this feature
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Handle analyzing reference
  if (isAnalyzingReference) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Image
          source={{ uri: currentReferenceUri }}
          className="w-48 h-48 rounded-xl mb-6"
          resizeMode="cover"
        />
        <LoadingSpinner message="Analyzing your reference photo..." />
      </SafeAreaView>
    );
  }

  // Handle analysis error
  if (analysisError && !currentAnalysis) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center px-8">
        <Text className="text-red-400 text-lg text-center mb-2">
          Failed to analyze image
        </Text>
        <Text className="text-gray-400 text-center mb-6">{analysisError}</Text>
        <Pressable
          onPress={() => analyze(currentReferenceUri)}
          className="bg-primary-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture photo");
      }

      // Save the image
      const savedUri = await saveImage(photo.uri);

      // Create project if doesn't exist
      let projectId = currentProjectId;
      if (!projectId && currentAnalysis) {
        const project = createProject(
          `Project ${new Date().toLocaleDateString()}`,
          currentReferenceUri,
          currentAnalysis
        );
        projectId = project.id;
      }

      // Add attempt
      if (projectId) {
        const attempt: Attempt = {
          id: `attempt-${Date.now()}`,
          imageUri: savedUri,
          capturedAt: new Date().toISOString(),
          guidance: guidance
            ? { ...guidance, timestamp: new Date().toISOString() }
            : null,
          matchScore: guidance?.overallMatch ?? 0,
        };
        addAttempt(projectId, attempt);

        Alert.alert(
          "Photo Captured!",
          `Match score: ${attempt.matchScore}%`,
          [
            { text: "Take Another", style: "cancel" },
            {
              text: "View Project",
              onPress: () => router.replace(`/project/${projectId}`),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Capture error:", error);
      Alert.alert("Error", "Failed to capture photo");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleClose = () => {
    Alert.alert(
      "Leave Camera?",
      "Your progress will be saved.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", onPress: () => router.back() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      >
        {/* Guidance Overlay */}
        {currentAnalysis && <GuidanceOverlay />}

        {/* Reference thumbnail */}
        <View className="absolute top-14 right-4">
          <Image
            source={{ uri: currentReferenceUri }}
            className="w-20 h-20 rounded-lg border-2 border-white"
            resizeMode="cover"
          />
          <Text className="text-white text-xs text-center mt-1 bg-black/50 rounded px-1">
            Reference
          </Text>
        </View>
      </CameraView>

      {/* Controls */}
      <SafeAreaView edges={["bottom"]} className="bg-black">
        <View className="flex-row items-center justify-between px-8 py-4">
          {/* Close button */}
          <IconButton
            icon={<X size={24} color="white" />}
            variant="ghost"
            onPress={handleClose}
          />

          {/* Capture button */}
          <CaptureButton onCapture={handleCapture} disabled={isCapturing} />

          {/* Pause/Play button */}
          <IconButton
            icon={
              isPaused ? (
                <Play size={24} color="white" />
              ) : (
                <Pause size={24} color="white" />
              )
            }
            variant="ghost"
            onPress={togglePause}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
