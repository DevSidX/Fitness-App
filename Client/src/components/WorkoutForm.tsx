import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { type WorkoutFormData } from "../types/workout";

interface WorkoutFormProps {
  loading: boolean;
  onGenerate: (data: WorkoutFormData) => void;
}

const WorkoutForm = ({ loading, onGenerate }: WorkoutFormProps) => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    age: 20,
    gender: "male",
    height: 170,
    weight: 70,
    goal: "maintain",
    workoutDays: 5,
    equipment: "gym",
    experience: "beginner",
  });

  const updateField = (
    field: keyof WorkoutFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
        Workout Details
      </h3>

      <div className="space-y-4">
        <Input
          label="Age"
          type="number"
          value={formData.age}
          onChange={(value) => updateField("age", Number(value))}
        />

        <Select
          label="Gender"
          value={formData.gender}
          onChange={(value) => updateField("gender", value)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />

        <Input
          label="Height (cm)"
          type="number"
          value={formData.height}
          onChange={(value) => updateField("height", Number(value))}
        />

        <Input
          label="Weight (kg)"
          type="number"
          value={formData.weight}
          onChange={(value) => updateField("weight", Number(value))}
        />

        <Select
          label="Goal"
          value={formData.goal}
          onChange={(value) => updateField("goal", value)}
          options={[
            { value: "lose", label: "Weight Loss" },
            { value: "maintain", label: "Maintain Weight" },
            { value: "gain", label: "Muscle Gain" },
          ]}
        />

        <Input
          label="Workout Days"
          type="number"
          min={1}
          max={7}
          value={formData.workoutDays}
          onChange={(value) =>
            updateField("workoutDays", Number(value))
          }
        />

        <Select
          label="Equipment"
          value={formData.equipment}
          onChange={(value) => updateField("equipment", value)}
          options={[
            { value: "gym", label: "Gym" },
            { value: "home", label: "Home" },
          ]}
        />

        <Select
          label="Experience"
          value={formData.experience}
          onChange={(value) => updateField("experience", value)}
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />

        <Button
          className="w-full"
          disabled={loading}
          onClick={() => onGenerate(formData)}
        >
          {loading ? "Generating..." : "Generate Workout"}
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutForm;