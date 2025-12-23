import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, Trash2, Info, ChevronRight } from "lucide-react-native";
import { useProjectStore } from "@/stores/projectStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProject, deleteProject, deleteAttempt, setCurrentReferenceUri, setCurrentAnalysis } =
    useProjectStore();

  const project = getProject(id);

  if (!project) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 text-lg">Project not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-600 font-medium">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleContinueShooting = () => {
    setCurrentReferenceUri(project.referenceImage.uri);
    setCurrentAnalysis(project.referenceImage.analysis);
    router.push("/camera");
  };

  const handleDeleteProject = () => {
    Alert.alert(
      "Delete Project?",
      "This will permanently delete the project and all attempts.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProject(project.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDeleteAttempt = (attemptId: string) => {
    Alert.alert("Delete Attempt?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAttempt(project.id, attemptId),
      },
    ]);
  };

  const analysis = project.referenceImage.analysis;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Reference Image */}
        <View className="bg-white">
          <Image
            source={{ uri: project.referenceImage.uri }}
            className="w-full aspect-square"
            resizeMode="cover"
          />
        </View>

        <View className="p-4">
          {/* Project Info */}
          <Card variant="default" className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xl font-bold text-gray-800">{project.name}</Text>
              <IconButton
                icon={<Trash2 size={20} color="#ef4444" />}
                variant="ghost"
                onPress={handleDeleteProject}
              />
            </View>
            <Text className="text-gray-500 text-sm">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </Text>
          </Card>

          {/* Analysis Summary */}
          {analysis && (
            <Card variant="outlined" className="mb-4">
              <View className="flex-row items-center mb-3">
                <Info size={18} color="#2563eb" />
                <Text className="font-semibold text-gray-800 ml-2">
                  Reference Analysis
                </Text>
              </View>
              <View className="gap-2">
                <View className="flex-row">
                  <Text className="text-gray-500 w-24">Perspective:</Text>
                  <Text className="text-gray-800 flex-1">
                    {analysis.composition.perspective}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-500 w-24">Distance:</Text>
                  <Text className="text-gray-800 flex-1">
                    {analysis.composition.distanceEstimate}
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-500 w-24">Lighting:</Text>
                  <Text className="text-gray-800 flex-1">
                    {analysis.lighting.direction} ({analysis.lighting.quality})
                  </Text>
                </View>
                <View className="flex-row">
                  <Text className="text-gray-500 w-24">Focal Length:</Text>
                  <Text className="text-gray-800 flex-1">
                    {analysis.estimatedFocalLength}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Continue Shooting Button */}
          <Button
            onPress={handleContinueShooting}
            icon={<Camera size={20} color="white" />}
            fullWidth
          >
            Continue Shooting
          </Button>

          {/* Attempts */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Attempts ({project.attempts.length})
            </Text>

            {project.attempts.length === 0 ? (
              <Card variant="outlined">
                <View className="items-center py-4">
                  <Camera size={32} color="#9ca3af" />
                  <Text className="text-gray-400 mt-2">No attempts yet</Text>
                  <Text className="text-gray-400 text-sm">
                    Start shooting to add attempts
                  </Text>
                </View>
              </Card>
            ) : (
              <View className="gap-3">
                {project.attempts
                  .slice()
                  .reverse()
                  .map((attempt) => (
                    <Card key={attempt.id} variant="default" padding="sm">
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: attempt.imageUri }}
                          className="w-20 h-20 rounded-lg"
                          resizeMode="cover"
                        />
                        <View className="flex-1 ml-3">
                          <View className="flex-row items-center">
                            <Text className="font-medium text-gray-800">
                              Match: {attempt.matchScore}%
                            </Text>
                            {attempt.matchScore >= 85 && (
                              <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                                <Text className="text-green-700 text-xs font-medium">
                                  Great!
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-gray-400 text-sm mt-1">
                            {new Date(attempt.capturedAt).toLocaleString()}
                          </Text>
                        </View>
                        <IconButton
                          icon={<Trash2 size={16} color="#9ca3af" />}
                          variant="ghost"
                          size="sm"
                          onPress={() => handleDeleteAttempt(attempt.id)}
                        />
                      </View>
                    </Card>
                  ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
