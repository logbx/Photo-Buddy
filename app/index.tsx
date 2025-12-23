import { View, Text, Pressable, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, FolderOpen, Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useProjectStore } from "@/stores/projectStore";

export default function HomeScreen() {
  const router = useRouter();
  const { setCurrentReferenceUri, recentProjects } = useProjectStore();

  const handleNewProject = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need photo library permissions to select a reference image.");
      return;
    }

    // Pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCurrentReferenceUri(result.assets[0].uri);
      router.push("/camera");
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to take a reference photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCurrentReferenceUri(result.assets[0].uri);
      router.push("/camera");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Hero Section */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Camera size={40} color="#1d4ed8" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Photo Buddy
          </Text>
          <Text className="text-gray-500 text-center text-lg">
            Recreate the perfect shot with AI-powered guidance
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="gap-4 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Start a New Project
          </Text>

          <Pressable
            onPress={handleNewProject}
            className="bg-primary-600 rounded-2xl p-5 flex-row items-center active:bg-primary-700"
          >
            <View className="w-12 h-12 bg-primary-500 rounded-xl items-center justify-center mr-4">
              <Plus size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">
                Choose from Gallery
              </Text>
              <Text className="text-primary-200 text-sm">
                Select a reference photo to recreate
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleTakePhoto}
            className="bg-white border-2 border-gray-200 rounded-2xl p-5 flex-row items-center active:bg-gray-50"
          >
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4">
              <Camera size={24} color="#4b5563" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-lg">
                Take a Photo
              </Text>
              <Text className="text-gray-500 text-sm">
                Capture a reference photo now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Recent Projects */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Recent Projects
            </Text>
            <Link href="/gallery" asChild>
              <Pressable className="flex-row items-center">
                <Text className="text-primary-600 font-medium mr-1">
                  View All
                </Text>
                <FolderOpen size={18} color="#2563eb" />
              </Pressable>
            </Link>
          </View>

          {recentProjects.length === 0 ? (
            <View className="flex-1 items-center justify-center bg-gray-50 rounded-2xl p-8">
              <FolderOpen size={48} color="#9ca3af" />
              <Text className="text-gray-400 mt-4 text-center">
                No projects yet.{"\n"}Create your first project above!
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentProjects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/project/${project.id}`} asChild>
                  <Pressable className="bg-gray-50 rounded-xl p-4 flex-row items-center active:bg-gray-100">
                    <Image
                      source={{ uri: project.referenceImage.uri }}
                      className="w-16 h-16 rounded-lg mr-4"
                    />
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        {project.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {project.attempts.length} attempt{project.attempts.length !== 1 ? "s" : ""}
                      </Text>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
