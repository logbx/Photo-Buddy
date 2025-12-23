import { View, Text, FlatList, Image, Pressable, Alert } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trash2, Camera, FolderOpen } from "lucide-react-native";
import { useProjectStore } from "@/stores/projectStore";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Project } from "@/types/project";

export default function GalleryScreen() {
  const { projects, deleteProject } = useProjectStore();

  const handleDelete = (project: Project) => {
    Alert.alert(
      "Delete Project?",
      `Are you sure you want to delete "${project.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProject(project.id),
        },
      ]
    );
  };

  const renderProject = ({ item }: { item: Project }) => (
    <Link href={`/project/${item.id}`} asChild>
      <Pressable className="mb-4">
        <Card variant="elevated" padding="none">
          <View className="flex-row">
            <Image
              source={{ uri: item.referenceImage.uri }}
              className="w-28 h-28 rounded-l-2xl"
              resizeMode="cover"
            />
            <View className="flex-1 p-4 justify-between">
              <View>
                <Text className="font-semibold text-gray-800 text-lg" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {item.attempts.length} attempt{item.attempts.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs">
                {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="p-2">
              <IconButton
                icon={<Trash2 size={18} color="#ef4444" />}
                variant="ghost"
                size="sm"
                onPress={() => handleDelete(item)}
              />
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );

  if (projects.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
            <FolderOpen size={48} color="#9ca3af" />
          </View>
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            No projects yet
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Create your first project to start recreating amazing photos!
          </Text>
          <Link href="/" asChild>
            <Pressable className="bg-primary-600 px-6 py-3 rounded-xl flex-row items-center">
              <Camera size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Start New Project
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
