import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import moment from 'moment';
import { t } from '@/i18n';

const getTimeAgo = (createdDate: string): string => {
  const createdTime = moment(createdDate);
  const now = moment();
  const diffMinutes = now.diff(createdTime, "minutes");
  const diffHours = now.diff(createdTime, "hours");
  const diffDays = now.diff(createdTime, "days");

  if (diffMinutes < 60) {
    return `${diffMinutes} ${t("minuteAgo")}`;
  } else if (diffHours < 24) {
    return `${diffHours} ${t("hourAgo")}`;
  } else {
    return `${diffDays} ${t("dayAgo")}`;
  }
};

const LiveTimeAgo = ({ createdDate }: { createdDate: string }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(createdDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(createdDate));
    }, 60000); // update every 1 minute

    return () => clearInterval(interval);
  }, [createdDate]);

  return (
    <Text allowFontScaling={false} style={{ fontSize: 12, fontFamily: "SfProDisplayRegular" }}>
      {timeAgo}
    </Text>
  );
};

export default LiveTimeAgo;
