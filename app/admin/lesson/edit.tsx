import { Button } from "@/components/ui/button";
import {
  Edit,
  NumberInput,
  ReferenceInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
  useRecordContext,
} from "react-admin";

const GenerateExercisesButton = () => {
  const record = useRecordContext();

  if (!record) return null;

  const handleGenerate = async () => {
    try {
      const res = await fetch("/api/generate-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: record.id,
          topic: record.title, 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.challenges.length} challenges generated successfully!`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating exercises.");
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleGenerate}
      style={{ marginBottom: 16 }}
    >
      Generate AI Exercises
    </Button>
  );
};

export const LessonEdit = () => {
  return (
    <Edit>
      <SimpleForm toolbar={<Toolbar><SaveButton/></Toolbar>}>
        <GenerateExercisesButton/>
        <TextInput source="title" validate={[required()]} label="Title" />
        <ReferenceInput source="unitId" reference="units" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Edit>
  );
};
