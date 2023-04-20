import { api } from "@/api";
import React, { useEffect, useState } from "react";
import {
  ActionButton,
  AsyncListData,
  Button,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  TextField,
} from "@adobe/react-spectrum";
import { Character } from "../Table";
import { updateProgress } from "@/api/pagination";

interface EditorModalProps {
  item: Character;
  list: AsyncListData<Character>;
}

const EditorModal = ({ item, list }: EditorModalProps) => {
  const [countProgress, setCountProgress] = useState<string>(item.progress);
  const [error, setError] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        await updateProgress({ item, countProgress });
      } catch (e: any) {
        setError(e.message);
      }
    };
    fetch();
  }, [countProgress]);

  const handleClose = (close: () => void) => {
    close();

    // ERROR: Works only with setTimeout https://github.com/adobe/react-spectrum/discussions/1937
    setTimeout(() => {
      list.reload();
    }, 100);
  };

  return (
    <DialogTrigger type="modal">
      <ActionButton isQuiet>Edit</ActionButton>

      {(close) => (
        <Dialog width="400px">
          <Heading>Change Progress</Heading>
          <Divider />
          <Content>
            <Heading marginBottom="20px">{error}</Heading>
            <TextField
              type="number"
              label="Progress"
              value={countProgress}
              onChange={setCountProgress}
              width="100%"
              marginBottom="40px"
            />
            <Button
              variant="secondary"
              onPress={() => handleClose(close)}
              width="100%"
            >
              Cancel
            </Button>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

export default EditorModal;
