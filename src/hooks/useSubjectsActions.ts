import {useSubjects} from "../context/SubjectsContext";
import {SubjectsStorageService} from "../services/storage/local-storage";
import {toaster} from "@components/ui/toaster";
import {useParams} from "react-router";

export function useSubjectsActions() {
	const {setSubjectsData, setError, isSaving, setIsSaving, saved, setSaved} =
		useSubjects();
	const {id} = useParams();

	const initializeCareer = async () => {
		if (!id) return;

		try {
			const careerData = await SubjectsStorageService.getData(id);
			if (!careerData) {
				const initializedData = await SubjectsStorageService.initialize(id);
				setSubjectsData([
					{id, nombre: initializedData.nombre, data: initializedData},
				]);
			} else {
				setSubjectsData([{id, nombre: careerData.nombre, data: careerData}]);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error al inicializar la carrera";
			setError(new Error(errorMessage));
			toaster.create({
				title: "Error",
				description: errorMessage,
				type: "error",
				duration: 3000,
				meta: {closable: true},
			});
		}
	};

	const updateSubjectStatus = async ({
		subjectId,
		newStatus,
		nota,
		periodo,
		comentarios,
		userId,
	}: {
		subjectId: string;
		newStatus: string;
		nota?: string;
		periodo?: string;
		comentarios?: string;
		userId?: string;
	}) => {
		if (!id) {
			toaster.create({
				title: "Error",
				description: "No se encontró la carrera seleccionada",
				type: "error",
				duration: 3000,
				meta: {
					closable: true,
				},
			});
			return;
		}
		setIsSaving(true);
		setSaved(false);
		try {
			const updatedData = await SubjectsStorageService.updateSubjectStatus({
				careerId: id,
				subjectId,
				newStatus,
				nota,
				periodo,
				comentarios,
				userId: userId,
			});

			if (!updatedData) {
				// If update failed, try to reload the data
				const reloadedData = await SubjectsStorageService.getData(id);
				if (!reloadedData) {
					// Si no hay datos, inicializamos la carrera
					const initializedData = await SubjectsStorageService.initialize(id);
					setSubjectsData([
						{id, nombre: initializedData.nombre, data: initializedData},
					]);
				} else {
					setSubjectsData([
						{id, nombre: reloadedData.nombre, data: reloadedData},
					]);
				}
			} else {
				setSubjectsData([{id, nombre: updatedData.nombre, data: updatedData}]);
			}
			setIsSaving(true);
			setSaved(false);
			setTimeout(() => setIsSaving(false), 2000);
			setTimeout(() => setSaved(true), 2000);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al actualizar el estado de la materia";
			setError(new Error(errorMessage));

			toaster.create({
				title: "Error",
				description: errorMessage,
				type: "error",
				duration: 3000,
				meta: {
					closable: true,
				},
			});
			setIsSaving(false);
		}
	};

	return {updateSubjectStatus, initializeCareer, isSaving, saved};
}
