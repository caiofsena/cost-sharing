import type { ReactNode } from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import {
  ActivityCard,
  Badge,
  Button,
  ExpenseCard,
  Input,
  ParticipantCard,
  Select,
  StatusSelect,
  type SelectOption,
} from "@/components";

export default function ComponentsScreen() {
  const [status, setStatus] = useState<"pending" | "paid">("pending");
  const [selectedUsers, setSelectedUsers] = useState<SelectOption[]>([]);

  const sampleOptions: SelectOption[] = [
    { id: "1", name: "Jonas Santos", initials: "JS" },
    { id: "2", name: "Maria Oliveira", initials: "MO" },
    { id: "3", name: "Rafael Almeida", initials: "RA" },
    { id: "4", name: "Lucas Mendes", initials: "LM" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-800" contentContainerClassName="gap-8 px-6 py-10">
      <View>
        <Text className="font-heading-lg text-heading-lg text-gray-100">Components</Text>
        <Text className="mt-1 font-text-sm text-text-sm text-gray-300">Variações baseadas nas referências.</Text>
      </View>

      <Section title="Status Select">
        <View className="gap-6">
          <StatusSelect value={status} onChange={setStatus} />
          <StatusSelect value="paid" />
        </View>
      </Section>

      <Section title="Badges">
        <View className="items-start gap-4">
          <Badge status="pending" />
          <Badge status="partial" />
          <Badge status="paid" />
        </View>
      </Section>

      <Section title="Cards">
        <View className="gap-5">
          <ActivityCard
            amount="R$ 256,00"
            date="12/10/25"
            expenses="1 despesa"
            participants="2 pessoas"
            title="Ferias"
          />

          <ExpenseCard
            amount="R$ 2.200,00"
            initials={["JS", "MO", "RA", "LM", "JS", "RM"]}
            perPerson="R$ 1.100,00 / pessoa"
            status="pending"
            title="Aluguel da casa"
          />

          <ParticipantCard description="1 atividade" initials="JS" name="Jonas Santos" />
        </View>
      </Section>

      <Section title="Inputs">
        <View className="gap-5">
          <Input placeholder="Placeholder" />
          <Input value="Text" editable={false} />
          <Input value="Text" />
          <Input
            value="Text"
            suggestions={[
              { id: "1", initials: "UN", name: "User Name" },
              { id: "2", initials: "UN", name: "User Name" },
              { id: "3", initials: "UN", name: "User Name" },
              { id: "4", initials: "UN", name: "User Name" },
            ]}
          />
        </View>
      </Section>

      <Section title="Select">
        <View className="gap-5">
          <Select
            options={sampleOptions}
            value={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Selecionar usuários"
          />
        </View>
      </Section>

      <Section title="Buttons">
        <View className="items-center gap-8">
          <Button intent="primary">
            <Text className="font-label-sm text-label-sm text-gray-800">Primary</Text>
          </Button>
          <Button intent="secondary">
            <Text className="font-label-sm text-label-sm text-gray-800">Secondary</Text>
          </Button>
          <Button intent="danger">
            <Text className="font-label-sm text-label-sm text-gray-800">Danger</Text>
          </Button>
          <Button intent="primary" hasIconLeft>
            <Text className="font-label-sm text-label-sm text-gray-800">Primary</Text>
          </Button>
          <Button intent="secondary" hasIconLeft>
            <Text className="font-label-sm text-label-sm text-gray-800">Secondary</Text>
          </Button>
          <Button intent="danger" hasIconLeft>
            <Text className="font-label-sm text-label-sm text-gray-800">Danger</Text>
          </Button>
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4">
      <Text className="font-heading-sm text-heading-sm text-gray-100">{title}</Text>
      {children}
    </View>
  );
}
