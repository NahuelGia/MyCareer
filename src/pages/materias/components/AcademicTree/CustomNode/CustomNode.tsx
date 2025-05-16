import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { getNodeColor } from "../../../helper/TreeChatHelper";
import { Selector } from "./Selector";
import { DegreeModule } from "../../../../../types/enums/degreeModule";
import { useSubjectsActions } from "../../../../../hooks/useSubjectsActions";
import ModalMateria from "../../ModalMateria/ModalMateria";
import { useSubjects } from "../../../../../context/SubjectsContext";
import { useParams } from "react-router";
import { useUser } from "@/context/UserContext";

const CustomNode = ({
   id,
   data,
   sourcePosition,
   targetPosition,
}: {
   id: string;
   data: any;
   sourcePosition?: Position;
   targetPosition?: Position;
}) => {
   const { id: careerId } = useParams();
   const { user, isFetchingUser } = useUser();
   const { updateSubjectStatus } = useSubjectsActions();
   const { subjectsData } = useSubjects();
   const [isModalOpen, setIsModalOpen] = useState(false);

   const careerData = subjectsData?.find((c) => c.id === careerId);
   const currentSubject = careerData?.data.materias.find((m) => m.id === id);
   const currentData = currentSubject?.data || data;

   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if ((e.target as HTMLElement).closest(".selector-wrapper")) return;
      setIsModalOpen(true);
   };

   const handleStatusChange = async (newStatus: string) => {
      await updateSubjectStatus({ subjectId: id, newStatus, userId: user?.id });
   };

   const degree = currentData.degreeModule;
   return (
      <>
         <Box
            bg={currentData.available ? getNodeColor(currentData.status) : "gray.300"}
            borderWidth={degree == DegreeModule.COMPLEMENTARIO ? "1.5px" : "1px"}
            borderColor={degree == DegreeModule.COMPLEMENTARIO ? "red.400" : "gray.800"}
            borderStyle={degree == DegreeModule.COMPLEMENTARIO ? "dashed" : "solid"}
            borderRadius="md"
            minW={"8rem"}
            minH={"4rem"}
            p={1}
            color="black"
            boxShadow="none"
            position="relative"
            transition="all 0.2s ease-in-out"
            onClick={(e) => handleClick(e)}
            _hover={{
               transform: "scale(1.05)",
               boxShadow: "md",
            }}
         >
            {targetPosition && <Handle type="target" position={targetPosition} />}

            <Center minH={"4rem"} minW="8rem">
               <Flex
                  direction="row"
                  alignItems="center"
                  justify="space-evenly"
                  w="100%"
                  h="100%"
               >
                  <Flex direction="column" justify="center">
                     <Text
                        maxWidth="6rem"
                        textStyle="xs"
                        wordBreak="break-word"
                        textAlign="center"
                     >
                        {currentData.label}
                     </Text>
                  </Flex>

                  <Flex
                     align="center"
                     justify="center"
                     h="100%"
                     className="selector-wrapper"
                  >
                     {currentData.available && (
                        <Flex align="center" justify="center" h="100%">
                           <Selector
                              onChangeStatus={handleStatusChange}
                              currentStatus={currentData.status}
                              disabled={isFetchingUser}
                           />
                        </Flex>
                     )}
                  </Flex>
               </Flex>
            </Center>

            {sourcePosition && <Handle type="source" position={sourcePosition} />}
         </Box>
         <ModalMateria
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={currentData}
            status={currentData.status}
            setStatus={handleStatusChange}
            nota={currentData.nota || ""}
            setNota={(value) =>
               updateSubjectStatus({
                  subjectId: id,
                  newStatus: currentData.status,
                  nota: value,
               })
            }
            periodo={currentData.periodo || ""}
            setPeriodo={(value) =>
               updateSubjectStatus({
                  subjectId: id,
                  newStatus: currentData.status,
                  periodo: value,
               })
            }
            comentarios={currentData.comentarios || ""}
            setComentarios={(value) =>
               updateSubjectStatus({
                  subjectId: id,
                  newStatus: currentData.status,
                  comentarios: value,
               })
            }
         />
      </>
   );
};

export default memo(CustomNode);
