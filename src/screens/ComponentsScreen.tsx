import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import {
  ActivityCard,
  Badge,
  BottomNavigation,
  Button,
  ExpenseCard,
  Input,
  ParticipantCard,
  StatusSelect,
} from "../components";

export default function ComponentsScreen() {
  const [tab, setTab] = useState<"activities" | "summary" | "participants">("activities");
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  return (
    <ScrollView className="flex-1 bg-gray-800" contentContainerClassName="gap-8 px-6 py-10">
      <View>
        <Text className="font-heading-lg text-heading-lg text-gray-100">Components</Text>
        <Text className="mt-1 font-text-sm text-text-sm text-gray-300">
          Variações baseadas nas referências.
        </Text>
      </View>

      <Section title="Bottom Navigation">
        <BottomNavigation value={tab} onChange={setTab} />
        <BottomNavigation value="summary" />
        <BottomNavigation value="participants" />
      </Section>

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

      <Section title="Buttons">
        <View className="items-center gap-8">
          <Button intent="primary" label="Label" />
          <Button intent="secondary" label="Label" />
          <Button intent="danger" label="Label" />
          <Button intent="primary" size="icon" />
          <Button intent="secondary" size="icon" />
          <Button intent="danger" size="icon" />
        </View>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-4">
      <Text className="font-heading-sm text-heading-sm text-gray-100">{title}</Text>
      {children}
    </View>
  );
}
