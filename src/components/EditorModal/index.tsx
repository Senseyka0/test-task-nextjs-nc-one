import { useState } from "react";
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
import { updatePerson } from "@/api/people";
import useDebounce from "@/hooks/useDebounce";

interface EditorModalProps {
	item: Character;
	list: AsyncListData<Character>;
}

const EditorModal = ({ item, list }: EditorModalProps) => {
	const [countProgress, setCountProgress] = useState<string>(item.progress);
	const [error, setError] = useState("");

	const debouncedValue = useDebounce<string>(countProgress, 500);

	const handleSave = (close: () => void) => {
		const fetch = async () => {
			try {
				await updatePerson({
					id: item.id,
					data: { progress: debouncedValue },
				});
			} catch (e: any) {
				setError(e.message);
			}
		};
		fetch();

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

						<Button variant="secondary" onPress={() => handleSave(close)} width="100%">
							Save
						</Button>
					</Content>
				</Dialog>
			)}
		</DialogTrigger>
	);
};

export default EditorModal;
