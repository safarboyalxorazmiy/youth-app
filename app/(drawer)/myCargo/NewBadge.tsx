import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

type Props = {
  createdDate: string | null;
};

const NewBadge = ({ createdDate }: Props) => {
  const [visible, setVisible] = useState(false);

  const checkIsNew = () => {
    if (!createdDate) return false;
    const now = Date.now();
    const created = new Date(createdDate).getTime();
    const diffMinutes = (now - created) / 60000;
    return diffMinutes <= 15;
  };

  useEffect(() => {
    setVisible(checkIsNew()); // initial check
    const interval = setInterval(() => {
      setVisible(checkIsNew());
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [createdDate]);

  if (!visible) return <View></View>;

  return (
    <View style={{
      alignItems: "center",
      justifyContent: "center",
      width: 56,
      height: 30,
      backgroundColor: "#2CA82A",
      borderRadius: 8
    }}>
      <Text allowFontScaling={false} style={{
        fontSize: 12,
        color: "#FFF",
        fontFamily: "SfProDisplayBold",
        fontWeight: "700"
      }}>
        {t("new")}
      </Text>
    </View>
  );
};

export default NewBadge;
